import React, { useId, useState, useMemo } from "react";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { useQuery } from "react-query";
import { useAuthUser } from "react-auth-kit";
import { MonitoringWellsTable } from "./MonitoringWellsTable";
import { MonitoringWellsPlot } from "./MonitoringWellsPlot";
import {
  NewMeasurementModal,
  UpdateMeasurementModal,
} from "../../components/WellMeasurementModals";
import {
  NewWellMeasurement,
  PatchWellMeasurement,
  ST2Measurement,
  SecurityScope,
  WellMeasurementDTO,
  MonitoredWell,
} from "../../interfaces";
import {
  useCreateWaterLevel,
  useUpdateWaterLevel,
  useDeleteWaterLevel,
} from "../../service/ApiServiceNew";
import dayjs from "dayjs";
import { useFetchWithAuth } from "../../hooks/useFetchWithAuth";
import { getDataStreamId } from "../../utils/DataStreamUtils";

export default function MonitoringWellsView() {
  const fetchWithAuth = useFetchWithAuth();
  const selectWellId = useId();
  const [wellId, setWellId] = useState<number>();
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<PatchWellMeasurement>({
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
    data: wells,
    isLoading: isLoadingWells,
    error: errorWells,
  } = useQuery<{ items: MonitoredWell[] }, Error, MonitoredWell[]>({
    queryKey: ["wells"],
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
  } = useQuery<WellMeasurementDTO[], Error>({
    queryKey: ["manualMeasurements", wellId],
    queryFn: () => fetchWithAuth("GET", "/waterlevels", { well_id: wellId }),
    enabled: !!wellId,
  });

  const dataStreamId = useMemo(
    () => (wells && wellId ? getDataStreamId(wells, wellId) : undefined),
    [wells, wellId],
  );

  const {
    data: st2Measurements,
    isLoading: isLoadingSt2,
    error: errorSt2,
  } = useQuery<ST2Measurement[], Error>({
    queryKey: ["st2Measurements", dataStreamId],
    queryFn: () =>
      fetchWithAuth("GET", `Datastreams(${dataStreamId})/Observations`),
    enabled: !!dataStreamId,
  });

  const createMeasurement = useCreateWaterLevel();
  const updateMeasurement = useUpdateWaterLevel(() => refetchManual());
  const deleteMeasurement = useDeleteWaterLevel();

  const error = errorWells || errorManual || errorSt2;

  const handleSubmitNewMeasurement = (data: NewWellMeasurement) => {
    if (wellId) {
      data.well_id = wellId;
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

  const handleMeasurementSelect = (rowdata: any) => {
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
    <Box>
      <Typography variant="h2" sx={{ color: "#292929", fontWeight: "500" }}>
        Monitored Well Values
      </Typography>

      <Card sx={{ width: "95%", height: "75%" }}>
        <CardContent>
          {error && (
            <Typography variant="h4">
              An error had occurred while attempting to loading data
            </Typography>
          )}

          <FormControl
            sx={{ minWidth: "100px" }}
            disabled={isLoadingWells || !!errorWells}
          >
            <InputLabel id={`${selectWellId}-label`}>Site</InputLabel>
            <Select
              label="Site"
              labelId={`${selectWellId}-label`}
              value={wellId ?? ""}
              onChange={(e) => setWellId(e.target.value as number)}
            >
              {isLoadingWells && <MenuItem disabled>Loading...</MenuItem>}
              {errorWells && <MenuItem disabled>Error loading wells</MenuItem>}
              {wells?.map((well) => (
                <MenuItem key={well.id} value={well.id}>
                  {well.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: "1rem", gap: "1rem", display: "flex", width: "100%" }}>
            <MonitoringWellsTable
              rows={manualMeasurements ?? []}
              isWellSelected={!!wellId}
              onOpenModal={() => setIsNewModalOpen(true)}
              onMeasurementSelect={handleMeasurementSelect}
            />
            <MonitoringWellsPlot
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
