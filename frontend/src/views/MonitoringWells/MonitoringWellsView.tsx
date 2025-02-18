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
  const [wellId, setWellId] = useState<number | undefined>();

  const authUser = useAuthUser();
  const hasAdminScope = authUser()
    ?.user_role.security_scopes.map(
      (scope: SecurityScope) => scope.scope_string,
    )
    .includes("admin");

  const [isNewMeasurementModalOpen, setIsNewMeasurementModalOpen] =
    useState<boolean>(false);
  const [isUpdateMeasurementModalOpen, setIsUpdateMeasurementModalOpen] =
    useState<boolean>(false);
  const handleOpenNewMeasurementModal = () =>
    setIsNewMeasurementModalOpen(true);
  const handleCloseNewMeasurementModal = () =>
    setIsNewMeasurementModalOpen(false);
  const handleCloseUpdateMeasurementModal = () =>
    setIsUpdateMeasurementModalOpen(false);

  const [selectedMeasurement, setSelectedMeasurement] =
    useState<PatchWellMeasurement>({
      levelmeasurement_id: 0,
      timestamp: dayjs(),
      value: 0,
      submitting_user_id: 0,
    });

  function handleMeasurementSelect(rowdata: any) {
    if (!hasAdminScope) {
      return;
    }
    console.log(rowdata);
    let measure_data: PatchWellMeasurement = {
      levelmeasurement_id: rowdata.row.id,
      timestamp: dayjs.utc(rowdata.row.timestamp).tz("America/Denver"),
      value: rowdata.row.value,
      submitting_user_id: rowdata.row.submitting_user.id,
    };
    setSelectedMeasurement(measure_data);
    setIsUpdateMeasurementModalOpen(true);
  }

  const {
    data: wells,
    isLoading: isLoadingWells,
    error: errorWells,
  } = useQuery<{ items: MonitoredWell[] }, Error, MonitoredWell[]>({
    queryKey: ["monitoredWells"],
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
    isLoading: isLoadingManualMeasurements,
    error: errorManualMeasurements,
    refetch: refetchManualMeasurements,
  } = useQuery<WellMeasurementDTO[], Error>({
    queryKey: ["manualWaterLevelMeasurements", wellId],
    queryFn: () =>
      fetchWithAuth("GET", "/waterlevels", {
        well_id: wellId,
      }),
    enabled: wellId !== undefined,
  });

  const dataStreamId = useMemo(() => {
    if (wells && wellId) {
      return getDataStreamId(wells, wellId);
    }
    return undefined;
  }, [wells, wellId]);

  const {
    data: st2Measurements,
    isLoading: isLoadingSt2Measurements,
    error: errorSt2Measurements,
  } = useQuery<ST2Measurement[], Error>({
    queryKey: ["st2WaterLevelMeasurements", wellId],
    queryFn: () =>
      fetchWithAuth("GET", `Datastreams(${dataStreamId})/Observations`, {
        well_id: wellId,
      }),
    enabled: !!dataStreamId,
  });

  const createWaterLevel = useCreateWaterLevel();

  const isLoading =
    isLoadingWells || isLoadingManualMeasurements || isLoadingSt2Measurements;
  const error = errorWells || errorManualMeasurements || errorSt2Measurements;

  const updateWaterLevel = useUpdateWaterLevel(() =>
    refetchManualMeasurements(),
  );
  const deleteWaterLevel = useDeleteWaterLevel();

  function handleSubmitNewMeasurement(measurementData: NewWellMeasurement) {
    if (wellId) measurementData.well_id = wellId ?? 0;
    createWaterLevel.mutate(measurementData);
    handleCloseNewMeasurementModal();
  }

  // Function for updating selected measurement values
  function handleUpdateMeasurement(updateValue: Partial<PatchWellMeasurement>) {
    setSelectedMeasurement({ ...selectedMeasurement, ...updateValue });
  }

  function handleSubmitMeasurementUpdate() {
    updateWaterLevel.mutate(selectedMeasurement);
    setIsUpdateMeasurementModalOpen(false);
  }

  function handleDeleteMeasurement() {
    setIsUpdateMeasurementModalOpen(false);

    //Confirm deletion before proceeding
    if (window.confirm("Are you sure you want to delete this measurement?")) {
      deleteWaterLevel.mutate(selectedMeasurement.levelmeasurement_id);
    }
  }

  return (
    <Box>
      <Typography variant="h2" sx={{ color: "#292929", fontWeight: "500" }}>
        Monitored Well Values
      </Typography>
      <Card sx={{ width: "95%", height: "75%" }}>
        <CardContent>
          {isLoading && <Typography variant="h4">Loading...</Typography>}
          {error && <Typography variant="h4">Error loading data</Typography>}
          {!isLoading && !error && (
            <>
              <FormControl sx={{ minWidth: "100px" }}>
                <InputLabel id={`${selectWellId}-label`}>Site</InputLabel>
                <Select
                  labelId={`${selectWellId}-label`}
                  value={wellId ?? ""}
                  onChange={(e) => setWellId(e.target.value as number)}
                >
                  <MenuItem value="" disabled>
                    Select a Well
                  </MenuItem>
                  {wells?.map((well) => (
                    <MenuItem key={well.id} value={well.id}>
                      {well.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {manualMeasurements && wellId && (
                <Box sx={{ marginTop: 2 }}>
                  <Typography variant="h6">
                    Measurements for Well ID: {wellId}
                  </Typography>
                  <pre>{JSON.stringify(manualMeasurements, null, 2)}</pre>
                </Box>
              )}
            </>
          )}
          <Box sx={{ mt: "10px", display: "flex" }}>
            <MonitoringWellsTable
              rows={manualMeasurements ?? []}
              isWellSelected={wellId != undefined ? true : false}
              onOpenModal={handleOpenNewMeasurementModal}
              onMeasurementSelect={handleMeasurementSelect}
            />
            <MonitoringWellsPlot
              isLoading={
                isLoadingManualMeasurements || isLoadingSt2Measurements
              }
              manual_dates={manualMeasurements?.map((m) => m.timestamp) ?? []}
              manual_vals={manualMeasurements?.map((m) => m.value) ?? []}
              logger_dates={st2Measurements?.map((m) => m.resultTime) ?? []}
              logger_vals={st2Measurements?.map((m) => m.result) ?? []}
            />
          </Box>
          <NewMeasurementModal
            isNewMeasurementModalOpen={isNewMeasurementModalOpen}
            handleCloseNewMeasurementModal={handleCloseNewMeasurementModal}
            handleSubmitNewMeasurement={handleSubmitNewMeasurement}
          />
          <UpdateMeasurementModal
            isMeasurementModalOpen={isUpdateMeasurementModalOpen}
            handleCloseMeasurementModal={handleCloseUpdateMeasurementModal}
            measurement={selectedMeasurement}
            onUpdateMeasurement={handleUpdateMeasurement}
            onSubmitUpdate={handleSubmitMeasurementUpdate}
            onDeleteMeasurement={handleDeleteMeasurement}
          />{" "}
        </CardContent>
      </Card>
    </Box>
  );
}
