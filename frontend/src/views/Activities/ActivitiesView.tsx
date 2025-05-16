import {
  Box,
  Grid,
  CardContent,
  Card,
  CardHeader,
  Typography,
} from "@mui/material";
import MeterActivityEntry from "./MeterActivityEntry/MeterActivityEntry";
import { Construction } from "@mui/icons-material";

export const gridBreakpoints = { xs: 12 };
export const toggleStyle = {
  "&.Mui-selected": { borderColor: "blue", border: 1 },
};

export const ActivitiesView = () => {
  return (
    <Box
      sx={{ height: "fit-content", width: "calc(100% - 16px)", m: 2, mt: 1 }}
    >
      <Card sx={{ height: "fit-content", width: "calc(100% - 16px)" }}>
        <CardHeader
          title={
            <div className="custom-card-header">
              <span>Submit an Activity</span> <Construction />
            </div>
          }
          sx={{ mb: 0, pb: 0 }}
        />
        <CardContent>
          <Grid container>
            <Grid item xs={11} sm={11} lg={8} xl={7}>
              <MeterActivityEntry />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
