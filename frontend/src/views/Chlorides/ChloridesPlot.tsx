import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";

export const ChloridesPlot = ({
  manual_dates,
  manual_vals,
  isLoading,
}: {
  manual_dates: Date[];
  manual_vals: { value: number; well: string }[];
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

  const data: Partial<Data>[] = useMemo(() => {
    const wellData: Record<string, { x: Date[]; y: number[] }> = {};

    manual_vals.forEach((entry, idx) => {
      if (!wellData[entry.well]) {
        wellData[entry.well] = { x: [], y: [] };
      }
      wellData[entry.well].x.push(manual_dates[idx]);
      wellData[entry.well].y.push(entry.value);
    });

    return Object.entries(wellData).map(([well, { x, y }], index) => ({
      x,
      y,
      type: "scatter",
      mode: "markers",
      marker: { color: generateColorScale(index) },
      name: `Well ${well}`,
    }));
  }, [manual_dates, manual_vals]);

  return (
    <Box sx={{ height: 600, width: 800 }}>
      <Plot
        data={data}
        layout={{
          autosize: true,
          legend: {
            title: { text: "Datastreams", font: { size: 14 } },
          },
          xaxis: { title: { text: "Date", font: { size: 16 } } },
          yaxis: {
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

const generateColorScale = (n: number) => {
  const colors = [
    "#1f77b4",
    "#ff7f0e",
    "#2ca02c",
    "#d62728",
    "#9467bd",
    "#8c564b",
    "#e377c2",
    "#7f7f7f",
    "#bcbd22",
    "#17becf",
  ];
  return colors[n % colors.length];
};
