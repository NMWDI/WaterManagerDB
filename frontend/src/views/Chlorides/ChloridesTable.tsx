import { useMemo } from "react";
import { Box, Button, Tooltip } from "@mui/material";
import { DataGrid, GridPagination, GridColDef } from "@mui/x-data-grid";
import { MonitoredWell, WellMeasurementDTO } from "../../interfaces";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    onOpenModal: () => void;
    isWellSelected: boolean;
    selectedWell?: MonitoredWell;
  }
}

export const ChloridesTable = ({
  rows,
  onOpenModal,
  isWellSelected,
  selectedWell,
  onMeasurementSelect,
}: {
  rows: WellMeasurementDTO[];
  onOpenModal: () => void;
  isWellSelected: boolean;
  selectedWell?: MonitoredWell;
  onMeasurementSelect: (data: {
    row: {
      id: number;
      timestamp: Dayjs;
      value: number;
      submitting_user: {
        id: number;
      };
    };
  }) => void;
}) => {
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "timestamp",
        headerName: "Date/Time",
        width: 200,
        valueGetter: (value) => dayjs.utc(value).tz("America/Denver"),
        valueFormatter: (value) =>
          dayjs.utc(value).tz("America/Denver").format("MM/DD/YYYY hh:mm A"),
        type: "dateTime",
      },
      { field: "value", headerName: "Depth to Water (ft)", width: 175 },
      {
        field: "submitting_user",
        headerName: "User",
        width: 200,
        valueGetter: (value: WellMeasurementDTO["submitting_user"]) =>
          value.full_name,
      },
    ],
    [],
  );

  return (
    <Box sx={{ width: 600, height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{
          footer: Footer,
        }}
        slotProps={{
          footer: {
            onOpenModal: onOpenModal,
            isWellSelected: isWellSelected,
            selectedWell: selectedWell,
          },
        }}
        onRowClick={onMeasurementSelect}
      />
    </Box>
  );
};

const Footer = ({
  onOpenModal,
  isWellSelected,
  selectedWell,
}: {
  onOpenModal: () => void;
  isWellSelected: boolean;
  selectedWell?: MonitoredWell;
}) => {
  const isPlugged = selectedWell?.well_status.status === "plugged";

  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ my: "auto" }}>
        {isWellSelected ? (
          <Tooltip
            title={
              isPlugged
                ? "This well is plugged and no longer accepting new measurements."
                : ""
            }
            placement="top"
            arrow
          >
            <span>
              <Button disabled={isPlugged} variant="text" onClick={onOpenModal}>
                + Add Measurement
              </Button>
            </span>
          </Tooltip>
        ) : null}
      </Box>
      <GridPagination />
    </Box>
  );
};
