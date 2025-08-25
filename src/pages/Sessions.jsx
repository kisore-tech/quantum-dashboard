import { useMemo, useState } from "react";
import { Paper, Stack, Typography, Divider, Grid, Chip, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MemoryIcon from "@mui/icons-material/Memory";
import ApiIcon from "@mui/icons-material/Api";
import StatusDot from "../components/StatusDot";
import { STATUS_COLORS } from "../data";

export default function Sessions({ items }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Started (newest)");

  const filtered = useMemo(() => {
    let list = filter === "All" ? items : items.filter((s) => s.status === filter);
    switch (sortBy) {
      case "Status":            list = list.sort((a, b) => a.status.localeCompare(b.status)); break;
      case "Started (oldest)":  list = list.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt)); break;
      default:                  list = list.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    }
    return list;
  }, [items, filter, sortBy]);

  return (
    <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Stack direction="row" alignItems="center" gap={1.2}>
          <MemoryIcon />
          <Typography variant="h6">Sessions</Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filter} label="Status" onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Sort</InputLabel>
            <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
              {["Started (newest)", "Started (oldest)", "Status"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Divider sx={{ mb: 1.5, opacity: 0.2 }} />

      <Grid container spacing={1.5}>
        {filtered.map((s) => (
          <Grid key={s.id} item xs={12} md={6}>
            <Paper sx={{ p: 1.5, background: "rgba(255,255,255,0.06)" }} variant="outlined">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" gap={1.2}>
                  <ApiIcon fontSize="small" />
                  <Typography variant="subtitle1">
                    <StatusDot color={STATUS_COLORS[s.status]} />
                    {s.id}
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  label={s.status}
                sx={{
                      bgcolor: `${STATUS_COLORS[s.status]}22`, // add transparency with "22"
                      color: STATUS_COLORS[s.status],
                      border: "1px solid",
                      borderColor: STATUS_COLORS[s.status],
                    }}

                />
              </Stack>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Started: {new Date(s.startedAt).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  )};