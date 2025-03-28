import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";

export const ChloridesPlot = ({
  manual_dates,
  manual_vals,
  logger_dates,
  logger_vals,
  isLoading,
}: {
  manual_dates: Date[];
  manual_vals: number[];
  logger_dates: Date[];
  logger_vals: number[];
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <Box
        sx={{
          height: 600,
          width: 800,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Loading...</Typography>
      </Box>
    );
  }

  const data: Partial<Data>[] = useMemo(
    () => [
      {
        x: manual_dates,
        y: manual_vals,
        type: "scatter",
        mode: "markers",
        marker: { color: "red" },
        name: "Manual",
      },
      {
        x: logger_dates,
        y: logger_vals,
        type: "scatter",
        marker: { color: "blue" },
        name: "Continuous",
      },
    ],
    [manual_dates, manual_vals, logger_dates, logger_vals],
  );

  return (
    <Box sx={{ height: 600, width: 800 }}>
      <Plot
        data={data}
        layout={{
          autosize: true,
          title: "Chlorides Over Time",
          titlefont: { size: 18 },
          legend: {
            title: { text: "Datastreams", font: { size: 14 } },
          },
          xaxis: { title: { text: "Date", font: { size: 16 } } },
          yaxis: {
            autorange: "reversed",
            title: { text: "Chlorides (ppm)", font: { size: 16 } },
          },
          margin: { t: 40, b: 50, l: 60, r: 10 },
        }}
        useResizeHandler
        style={{ width: "100%", height: "100%" }}
      />
    </Box>
  );
};
