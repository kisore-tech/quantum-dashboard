import { useMemo } from "react";
import { Paper, Stack, Typography, Grid, Box } from "@mui/material";
import InsightsIcon from "@mui/icons-material/Insights";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";
import { STATUS_COLORS } from "../data";

export default function AnalyticsPanel({ backends, jobs }) {
  const backendStatusCounts = useMemo(() => {
    const counts = {};
    backends.forEach((b) => (counts[b.status] = (counts[b.status] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [backends]);

  const jobStatusCounts = useMemo(() => {
    const counts = {};
    jobs.forEach((j) => (counts[j.status] = (counts[j.status] || 0) + 1));
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  return (
    <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
      <Stack direction="row" alignItems="center" gap={1} mb={2}>
        <InsightsIcon /> <Typography variant="h6">Visual Analytics</Typography>
      </Stack>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Backends by Status</Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" data={backendStatusCounts} innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {backendStatusCounts.map((entry, idx) => (
                  <Cell key={`c-${idx}`} fill={STATUS_COLORS[entry.name] || "#90caf9"} />

                  ))}
                </Pie>
                <Legend /><ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>Jobs by Status</Typography>
          <Box sx={{ height: 240 }}>
            <ResponsiveContainer>
              <BarChart data={jobStatusCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /><YAxis allowDecimals={false} /><ReTooltip />
                <Bar dataKey="value" fill="#42a5f5">
                  {jobStatusCounts.map((entry, idx) => (
                    <Cell key={`b-${idx}`} fill={STATUS_COLORS[entry.name] || "#42a5f5"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )};