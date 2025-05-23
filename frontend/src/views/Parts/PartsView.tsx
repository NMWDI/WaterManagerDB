import { useEffect, useState } from "react";
import PartsTable from "./PartsTable";
import { Box, Grid } from "@mui/material";
import PartDetailsCard from "./PartDetailsCard";
import MeterTypesTable from "./MeterTypesTable";
import MeterTypeDetailsCard from "./MeterTypeDetailsCard";
import { MeterTypeLU } from "../../interfaces";

export default function PartsView() {
  const [selectedPartID, setSelectedPartID] = useState<number>();
  const [partAddMode, setPartAddMode] = useState<boolean>(true);
  const [selectedMeterType, setSelectedMeterType] = useState<MeterTypeLU>();
  const [meterTypeAddMode, setMeterTypeAddMode] = useState<boolean>(true);

  // Exit add mode when part is selected from table
  useEffect(() => {
    if (selectedPartID) setPartAddMode(false);
  }, [selectedPartID]);

  useEffect(() => {
    if (selectedMeterType) setMeterTypeAddMode(false);
  }, [selectedMeterType]);

  return (
    <Box sx={{ m: 2, mt: 1, pb: 3, width: "100%" }}>
      <Grid container spacing={4}>
        <Grid
          container
          item
          spacing={2}
          sx={{ minHeight: { xs: "100vh", lg: "70vh" } }}
        >
          <Grid item xs={7}>
            <PartsTable
              setSelectedPartID={setSelectedPartID}
              setPartAddMode={setPartAddMode}
            />
          </Grid>
          <Grid item xs={4}>
            <PartDetailsCard
              selectedPartID={selectedPartID}
              partAddMode={partAddMode}
            />
          </Grid>
        </Grid>
        <Grid
          container
          item
          spacing={2}
          sx={{ minHeight: { xs: "100vh", lg: "70vh" } }}
        >
          <Grid item xs={7}>
            <MeterTypesTable
              setSelectedMeterType={setSelectedMeterType}
              setMeterTypeAddMode={setMeterTypeAddMode}
            />
          </Grid>
          <Grid item xs={4}>
            <MeterTypeDetailsCard
              selectedMeterType={selectedMeterType}
              meterTypeAddMode={meterTypeAddMode}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
