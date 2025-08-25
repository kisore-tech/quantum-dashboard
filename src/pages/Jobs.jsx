import { useMemo, useState } from "react";
import {
  Paper, Stack, Typography, Divider, Grid, Chip, TextField,
  FormControl, InputLabel, Select, MenuItem, Drawer, Box, Button
} from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import ScienceIcon from "@mui/icons-material/Science";
import TimelineIcon from "@mui/icons-material/Timeline";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { STATUS_COLORS } from "../data";
import StatusDot from "../components/StatusDot";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip } from "recharts";

function mockHistogram(shots) {
  const bins = 8;
  const base = Math.max(1, Math.floor(shots / (bins * 8)));
  return Array.from({ length: bins }, (_, i) => ({
   bin: `b${i + 1}`,
   counts: base * (i < bins / 2 ? (i + 1) : (bins - i)),
  }));
}

function JobDetailsDrawer({ open, onClose, job }) {
  if (!job) return null;
  const color = STATUS_COLORS[job.status] || "#90caf9";
  const dt = new Date(job.submittedAt);
  const hdata = mockHistogram(job.shots);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 420, p: 2, bgcolor: "#fff" }}>
        <Stack direction="row" alignItems="center" gap={1} mb={1}>
          <BubbleChartIcon />
          <Typography variant="h6">Job Details</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />

        <Stack gap={1}>
          <Typography variant="subtitle1">
            <StatusDot color={color} /> {job.id}
          </Typography>
          <Stack direction="row" gap={1} alignItems="center">
            <Chip size="small" label={job.status} sx={{ bgcolor: `${color}22`, color, border: "1px solid", borderColor: color }} />
            <Chip size="small" icon={<ScienceIcon />} label={job.backend} />
            <Chip size="small" icon={<TimelineIcon />} label={`Shots: ${job.shots}`} />
          </Stack>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Submitted: {dt.toLocaleString()}
          </Typography>
          <Stack direction="row" gap={1} mt={1}>
            <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={() => navigator.clipboard.writeText(job.id)}>
              Copy Job ID
            </Button>
            <Button size="small" variant="contained" disabled={job.status === "Running" || job.status === "Queued"}>
              Resubmit
            </Button>
          </Stack>
        </Stack>

        <Typography variant="subtitle2" mt={3} gutterBottom>Mock Result Histogram</Typography>
        <Box sx={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={hdata}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bin" /><YAxis allowDecimals={false} />
              <ReTooltip />
              <Bar dataKey="counts" fill="#42a5f5" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Typography variant="subtitle2" mt={2} gutterBottom>Transpilation (mock)</Typography>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Chip label="Depth: 89" size="small" />
          <Chip label="Gates: 172" size="small" />
          <Chip label="CX: 34" size="small" />
          <Chip label="Mapping: SABRE" size="small" />
        </Stack>
      </Box>
    </Drawer>
  );
}

export default function Jobs({ items }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [backendFilter, setBackendFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Submitted (newest)");
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = items.filter((j) => {
      const str = `${j.id} ${j.backend}`.toLowerCase();
      const matchesText = str.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || j.status === statusFilter;
      const matchesBackend = backendFilter === "All" || j.backend === backendFilter;
      return matchesText && matchesStatus && matchesBackend;
    });
    switch (sortBy) {
      case "Status":              list = list.sort((a, b) => a.status.localeCompare(b.status)); break;
      case "Backend":             list = list.sort((a, b) => a.backend.localeCompare(b.backend)); break;
      case "Submitted (oldest)":  list = list.sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)); break;
      default:                    list = list.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    }
    return list;
  }, [items, search, statusFilter, backendFilter, sortBy]);

  const uniqueBackends = Array.from(new Set(items.map((j) => j.backend)));

  const openDetails = (job) => { setSelectedJob(job); setDetailsOpen(true); };
  const closeDetails = () => setDetailsOpen(false);

  return (
    <Paper sx={{ p: 2, bgcolor: "#fff" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Stack direction="row" alignItems="center" gap={1.2}>
          <HubIcon />
          <Typography variant="h6">Recent Jobs</Typography>
        </Stack>
        <Stack direction="row" gap={1} alignItems="center">
          <TextField
            size="small" placeholder="Search jobs (ID or backend)..."
            value={search} onChange={(e) => setSearch(e.target.value)} sx={{ minWidth: 260 }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {["Completed", "Running", "Failed", "Queued"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Backend</InputLabel>
            <Select label="Backend" value={backendFilter} onChange={(e) => setBackendFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              {uniqueBackends.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort</InputLabel>
            <Select label="Sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {["Submitted (newest)", "Submitted (oldest)", "Status", "Backend"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 1.5, opacity: 0.2 }} />

      <Grid container spacing={1.5}>
        {filtered.map((j) => {
          const color = STATUS_COLORS[j.status] || "#90caf9";
          const dt = new Date(j.submittedAt);
          return (
            <Grid key={j.id} item xs={12}>
              <Paper
                onClick={() => openDetails(j)}
                sx={{ p: 1.5, bgcolor: "#fff", cursor: "pointer" }}
                variant="outlined"
              >
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Stack direction="row" alignItems="center" gap={1.2}>
                    <BubbleChartIcon fontSize="small" />
                    <Typography variant="subtitle1">
                      <StatusDot color={color} />
                      {j.id}
                    </Typography>
                    <Chip size="small" label={j.status} sx={{ bgcolor: `${color}22`, color, border: "1px solid", borderColor: color }} />
                  </Stack>
                  <Stack direction="row" gap={1}>
                    <Chip icon={<ScienceIcon />} label={j.backend} size="small" />
                    <Chip icon={<TimelineIcon />} label={`Shots: ${j.shots}`} size="small" />
                    <Chip label={dt.toLocaleString()} size="small" />
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>No jobs found with the current filters.</Typography>
          </Grid>
        )}
      </Grid>

      <JobDetailsDrawer open={detailsOpen} onClose={closeDetails} job={selectedJob} />
    </Paper>
  );
}
