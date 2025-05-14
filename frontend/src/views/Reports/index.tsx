import {
  Assessment,
  Build,
  FormatListBulletedOutlined,
  MonitorHeart,
  People,
  Plumbing,
  Science,
} from "@mui/icons-material";
import { Box, Card, CardContent, CardHeader } from "@mui/material";
import { NavLink } from "../../components/NavLink";

export const ReportsView = () => {
  return (
    <Box
      sx={{ height: "fit-content", width: "calc(100% - 16px)", m: 2, mt: 1 }}
    >
      <Card sx={{ height: "fit-content", width: "calc(100% - 16px)" }}>
        <CardHeader
          title={
            <div className="custom-card-header">
              <span>Reports</span>
              <Assessment />
            </div>
          }
          sx={{ mb: 0, pb: 0 }}
        />
        <CardContent>
          <Box width="15%" py={1}>
            <NavLink
              route="/reports/workorders"
              label="Work Orders"
              Icon={FormatListBulletedOutlined}
            />
            <NavLink
              route="/reports/wells"
              label="Monitoring Wells"
              Icon={MonitorHeart}
            />
            <NavLink route="/reports/repairs" label="Repairs" Icon={Plumbing} />
            <NavLink
              route="/reports/inventory"
              label="Inventory"
              Icon={Build}
            />
            <NavLink route="/reports/board" label="Board" Icon={People} />
            <NavLink
              route="/reports/chlorides"
              label="Chlorides"
              Icon={Science}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
