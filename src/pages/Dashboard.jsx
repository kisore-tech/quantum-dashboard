import { Grid, Paper, Stack, Typography } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import HubIcon from "@mui/icons-material/Hub";
import MemoryIcon from "@mui/icons-material/Memory";
import AnalyticsPanel from "../components/AnalyticsPanel";

export default function Dashboard({ data }) {
  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <ScienceIcon />
              <Typography variant="subtitle2">Available Backends</Typography>
            </Stack>
            <Typography variant="h4" mt={1}>
              {data.backends.filter((b) => b.status === "Available").length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <HubIcon />
              <Typography variant="subtitle2">Running Jobs</Typography>
            </Stack>
            <Typography variant="h4" mt={1}>
              {data.jobs.filter((j) => j.status === "Running").length}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <MemoryIcon />
              <Typography variant="subtitle2">Active Sessions</Typography>
            </Stack>
            <Typography variant="h4" mt={1}>
              {data.sessions.filter((s) => s.status === "Active").length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <AnalyticsPanel backends={data.backends} jobs={data.jobs} />
    </>
  )};