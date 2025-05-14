import { Box, Card, CardContent, CardHeader } from "@mui/material";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

import WorkOrdersTable from "./WorkOrdersTable";

export default function WorkOrdersView() {
  return (
    <Box
      sx={{ height: "fit-content", width: "calc(100% - 16px)", m: 2, mt: 1 }}
    >
      <Card sx={{ height: "fit-content", width: "calc(100% - 16px)" }}>
        <CardHeader
          title={
            <div className="custom-card-header">
              <span>Work Orders</span>
              <FormatListBulletedOutlinedIcon />
            </div>
          }
          sx={{ mb: 0, pb: 0 }}
        />
        <CardContent>
          <WorkOrdersTable />
        </CardContent>
      </Card>
    </Box>
  );
}
