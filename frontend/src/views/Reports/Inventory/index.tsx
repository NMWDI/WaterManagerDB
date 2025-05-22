import { ArrowBack, Build, PictureAsPdf } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import ControlledDatepicker from "../../../components/RHControlled/ControlledDatepicker";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "react-query";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs, { Dayjs } from "dayjs";
import { API_URL } from "../../../config";
import { useAuthHeader } from "react-auth-kit";

export interface MeterType {
  id: number;
  brand: string;
  series: string | null;
  model: string;
  size: number;
  description: string;
  in_use: boolean;
}

export interface PartType {
  id: number;
  name: string;
  description: string;
}

export interface Part {
  id: number;
  part_number: string;
  description: string;
  vendor: string | null;
  count: number;
  note: string;
  in_use: boolean;
  commonly_used: boolean;
  price: number | null;
  part_type_id: number;
  part_type: PartType;
  meter_types: MeterType[];
}

const schema = yup.object().shape({
  from: yup.mixed<Dayjs>().nullable().required("From date is required"),
  to: yup
    .mixed<Dayjs>()
    .nullable()
    .required("To date is required")
    .test("is-after", "'To' date must be after 'From'", function (value) {
      const { from } = this.parent;
      return !from || !value || dayjs(value).isAfter(dayjs(from));
    }),
  parts: yup
    .array()
    .of(yup.number().required())
    .min(1, "At least one Part is required"),
});

const defaultSchema = {
  from: dayjs(),
  to: dayjs(),
  parts: [],
};

export const InventoryReportView = () => {
  const { control, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultSchema,
  });

  const authHeader = useAuthHeader();
  const partsQuery = useQuery<Part[]>({
    queryKey: ["Inventory", "report", "parts"],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/parts`, {
        headers: { Authorization: authHeader() },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch parts");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    cacheTime: 1000 * 60 * 60 * 24, // cache in memory for 24 hours
  });

  return (
    <Box
      sx={{ height: "fit-content", width: "calc(100% - 16px)", m: 2, mt: 1 }}
    >
      <Card sx={{ height: "fit-content", width: "calc(100% - 16px)" }}>
        <CardHeader
          title={
            <div className="custom-card-header">
              <span>Inventory Report</span>
              <Build />
            </div>
          }
          sx={{ mb: 0, pb: 0 }}
        />
        <CardContent>
          <Grid container justifyContent="space-between" alignContent="center">
            <Grid item>
              <Link to="/reports">
                <Tooltip title="Go back" placement="right">
                  <IconButton aria-label="return to reports page">
                    <ArrowBack />
                  </IconButton>
                </Tooltip>
              </Link>
            </Grid>
            <Grid item>
              <Tooltip title="Export report as PDF" placement="left">
                <IconButton aria-label="export report as pdf">
                  <PictureAsPdf />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid
            container
            justifyContent="flex-start"
            alignContent="center"
            gap={2}
            paddingTop={2}
            paddingBottom={2}
          >
            <Grid item>
              <ControlledDatepicker
                label="From"
                sx={{ minWidth: "15rem" }}
                control={control}
                name="from"
                views={["year", "month"]}
                openTo="year"
                format="YYYY MMMM"
              />
            </Grid>
            <Grid item>
              <ControlledDatepicker
                label="To"
                sx={{ minWidth: "15rem" }}
                control={control}
                name="to"
                views={["year", "month"]}
                openTo="year"
                format="YYYY MMMM"
              />
            </Grid>
            <Grid item>
              <Controller
                name="parts"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    disableClearable
                    filterOptions={(options: Part[], state: any) =>
                      options.filter((opt) =>
                        `${opt.part_number} ${opt.description}`
                          .toLowerCase()
                          .includes(state.inputValue.toLowerCase()),
                      )
                    }
                    options={
                      partsQuery?.data?.filter(
                        (opt: Part) => opt && opt.id != null,
                      ) ?? []
                    }
                    getOptionLabel={(option: Part) =>
                      typeof option === "string"
                        ? option
                        : `${option.part_number} ${option.description}`
                    }
                    isOptionEqualToValue={(a: Part, b: Part) => a?.id === b?.id}
                    value={field.value ?? null}
                    onChange={(_, value) => field.onChange(value?.id ?? null)}
                    loading={partsQuery.isLoading}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{ minWidth: "30rem" }}
                        label="Parts"
                        size="small"
                        placeholder="Begin typing to search"
                      />
                    )}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid container></Grid>
          <Grid container>
            <Grid item>
              <Button onClick={() => reset()}>Reset</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
