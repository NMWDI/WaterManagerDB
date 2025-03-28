import { useId, useState, useMemo } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Typography,
  CardHeader,
} from "@mui/material";
import { useQuery } from "react-query";
import { useAuthUser } from "react-auth-kit";
import { ChloridesTable } from "./ChloridesTable";
import { ChloridesPlot } from "./ChloridesPlot";
import {
  NewMeasurementModal,
  UpdateMeasurementModal,
} from "../../components/RegionMeasurementModals";
import {
  NewRegionMeasurement,
  PatchRegionMeasurement,
  ST2Measurement,
  SecurityScope,
  RegionMeasurementDTO,
  MonitoredRegion,
} from "../../interfaces";
import {
  useCreateWaterLevel,
  useUpdateWaterLevel,
  useDeleteWaterLevel,
} from "../../service/ApiServiceNew";
import dayjs, { Dayjs } from "dayjs";
import { useFetchWithAuth, useFetchST2 } from "../../hooks";
import { getDataStreamId } from "../../utils/DataStreamUtils";
import { Science } from "@mui/icons-material";

export default function ChloridesView() {
  const fetchWithAuth = useFetchWithAuth();
  const fetchSt2 = useFetchST2();
  const selectedRegionId = useId();
  const [regionId, setregionId] = useState<number>();
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<PatchRegionMeasurement>({
      levelmeasurement_id: 0,
      timestamp: dayjs(),
      value: 0,
      submitting_user_id: 0,
    });

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const authUser = useAuthUser();
  const isAdmin = authUser()?.user_role.security_scopes.some(
    (s: SecurityScope) => s.scope_string === "admin",
  );

  const {
    data: regions,
    isLoading: isLoadingRegions,
    error: errorRegions,
  } = useQuery<{ items: MonitoredRegion[] }, Error, MonitoredRegion[]>({
    queryKey: ["regions"],
    queryFn: () =>
      fetchWithAuth("GET", "/wells", {
        search_string: "monitoring",
        sort_by: "name",
        sort_direction: "asc",
      }),
    select: (res) => res.items,
  });

  const {
    data: manualMeasurements,
    isLoading: isLoadingManual,
    error: errorManual,
    refetch: refetchManual,
  } = useQuery<RegionMeasurementDTO[], Error>({
    queryKey: ["manualMeasurements", regionId],
    queryFn: () => fetchWithAuth("GET", "/waterlevels", { well_id: regionId }),
    enabled: !!regionId,
  });

  const dataStreamId = useMemo(
    () => (regionId ? getDataStreamId(regionId) : undefined),
    [regionId],
  );

  const {
    data: st2Measurements,
    isLoading: isLoadingSt2,
    error: errorSt2,
  } = useQuery<ST2Measurement[], Error>({
    queryKey: ["st2Measurements", dataStreamId],
    queryFn: () =>
      fetchSt2("GET", `/Datastreams(${dataStreamId})/Observations`),
    enabled: !!dataStreamId,
  });

  const createMeasurement = useCreateWaterLevel();
  const updateMeasurement = useUpdateWaterLevel(() => refetchManual());
  const deleteMeasurement = useDeleteWaterLevel();

  const error = errorRegions || errorManual || errorSt2;

  const handleSubmitNewMeasurement = (data: NewRegionMeasurement) => {
    if (regionId) {
      data.region_id = regionId;
      createMeasurement.mutate(data, { onSuccess: () => refetchManual() });
    }
    setIsNewModalOpen(false);
  };

  const handleSubmitMeasurementUpdate = () => {
    updateMeasurement.mutate(selectedMeasurement);
    setIsUpdateModalOpen(false);
  };

  const handleDeleteMeasurement = () => {
    setIsUpdateModalOpen(false);
    if (window.confirm("Are you sure you want to delete this measurement?")) {
      deleteMeasurement.mutate(selectedMeasurement.levelmeasurement_id);
    }
  };

  const handleMeasurementSelect = (rowdata: {
    row: {
      id: number;
      timestamp: Dayjs;
      value: number;
      submitting_user: {
        id: number;
      };
    };
  }) => {
    if (!isAdmin) return;
    setSelectedMeasurement({
      levelmeasurement_id: rowdata.row.id,
      timestamp: dayjs.utc(rowdata.row.timestamp).tz("America/Denver"),
      value: rowdata.row.value,
      submitting_user_id: rowdata.row.submitting_user.id,
    });
    setIsUpdateModalOpen(true);
  };

  return (
    <Box sx={{ height: "100%", width: "100%", m: 2, mt: 0 }}>
      <Card sx={{ width: "95%", height: "75%" }}>
        <CardHeader
          title={
            <div className="custom-card-header">
              <span>Chlorides</span>
              <Science />
            </div>
          }
          sx={{ mb: 0, pb: 0 }}
        />
        <CardContent>
          {error && (
            <Typography variant="h4">
              An error had occurred while attempting to loading data
            </Typography>
          )}

          <FormControl
            sx={{ minWidth: "100px" }}
            disabled={isLoadingRegions || !!errorRegions}
          >
            <InputLabel id={`${selectedRegionId}-label`}>Region</InputLabel>
            <Select
              label="Region"
              sx={{ width: "600px" }}
              labelId={`${selectedRegionId}-label`}
              value={regionId ?? ""}
              onChange={(e) => setregionId(Number(e.target.value))}
            >
              {isLoadingRegions && <MenuItem disabled>Loading...</MenuItem>}
              {errorRegions && (
                <MenuItem disabled>Error loading Regions</MenuItem>
              )}
              {regions?.map((region) => (
                <MenuItem key={region.id} value={region.id}>
                  {region.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: "1rem", gap: "1rem", display: "flex", width: "100%" }}>
            <ChloridesTable
              rows={manualMeasurements ?? []}
              isRegionSelected={!!regionId}
              onOpenModal={() => setIsNewModalOpen(true)}
              onMeasurementSelect={handleMeasurementSelect}
            />
            <ChloridesPlot
              isLoading={isLoadingManual || isLoadingSt2}
              manual_dates={manualMeasurements?.map((m) => m.timestamp) ?? []}
              manual_vals={manualMeasurements?.map((m) => m.value) ?? []}
              logger_dates={st2Measurements?.map((m) => m.resultTime) ?? []}
              logger_vals={st2Measurements?.map((m) => m.result) ?? []}
            />
          </Box>

          <NewMeasurementModal
            isNewMeasurementModalOpen={isNewModalOpen}
            handleCloseNewMeasurementModal={() => setIsNewModalOpen(false)}
            handleSubmitNewMeasurement={handleSubmitNewMeasurement}
          />

          <UpdateMeasurementModal
            isMeasurementModalOpen={isUpdateModalOpen}
            handleCloseMeasurementModal={() => setIsUpdateModalOpen(false)}
            measurement={selectedMeasurement}
            onUpdateMeasurement={(update) =>
              setSelectedMeasurement({ ...selectedMeasurement, ...update })
            }
            onSubmitUpdate={handleSubmitMeasurementUpdate}
            onDeleteMeasurement={handleDeleteMeasurement}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
