import { Assessment } from "@mui/icons-material";
import { Box, Card, CardContent, CardHeader } from "@mui/material";

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
        <CardContent></CardContent>
      </Card>
    </Box>
  );
};
