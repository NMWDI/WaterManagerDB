import { useState } from "react";
import { Box, Grid, CardContent, Card } from "@mui/material";
import TabPanel from "../../components/TabPanel";
import MeterActivityEntry from "./MeterActivityEntry/MeterActivityEntry";

export const gridBreakpoints = { xs: 12 };
export const toggleStyle = {
  "&.Mui-selected": { borderColor: "blue", border: 1 },
};

export default function ActivitiesView() {
  const [currentTabIndex, _] = useState(0);

  return (
    <Box sx={{ height: "100%", width: "100%", m: 2, mt: 0 }}>
      <h2 style={{ color: "#292929", fontWeight: "500" }}>
        Submit an Activity
      </h2>
      <Grid container>
        <Grid item xs={11} sm={11} lg={8} xl={7}>
          <Card>
            <CardContent>
              <TabPanel currentTabIndex={currentTabIndex} tabIndex={0}>
                <MeterActivityEntry />
              </TabPanel>
              <TabPanel currentTabIndex={currentTabIndex} tabIndex={1}>
                <div>Not Yet Implemented</div>
              </TabPanel>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
