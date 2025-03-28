import { useMemo } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridPagination, GridColDef } from "@mui/x-data-grid";
import { RegionMeasurementDTO } from "../../interfaces";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides extends Partial<FooterExtraProps> {}
}

interface FooterExtraProps {
  onOpenModal: () => void;
  isRegionSelected: boolean;
}

export const ChloridesTable = ({
  rows,
  onOpenModal,
  isRegionSelected,
  onMeasurementSelect,
}: {
  rows: RegionMeasurementDTO[];
  onOpenModal: () => void;
  isRegionSelected: boolean;
  onMeasurementSelect: (data: {
    row: {
      id: number;
      timestamp: Dayjs;
      value: number;
      submitting_user: {
        id: number;
      };
      well: number;
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
      { field: "value", headerName: "Chlorides (ppm)", width: 175 },
      {
        field: "submitting_user",
        headerName: "User",
        width: 200,
        valueGetter: (value: RegionMeasurementDTO["submitting_user"]) =>
          value.full_name,
      },
      { field: "well", headerName: "Well", width: 175 },
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
            isRegionSelected: isRegionSelected,
          },
        }}
        onRowClick={onMeasurementSelect}
      />
    </Box>
  );
};

const Footer = ({
  onOpenModal,
  isRegionSelected,
}: {
  onOpenModal?: () => void;
  isRegionSelected?: boolean;
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ my: "auto" }}>
        {isRegionSelected ? (
          <Button variant="text" onClick={onOpenModal}>
            + Add Measurement
          </Button>
        ) : null}
      </Box>
      <GridPagination />
    </Box>
  );
};
