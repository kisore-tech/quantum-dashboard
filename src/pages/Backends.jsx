import { useMemo, useState } from "react";
import { Paper, Stack, Typography, Divider, Grid, Chip, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ScienceIcon from "@mui/icons-material/Science";
import SensorsIcon from "@mui/icons-material/Sensors";
import MemoryIcon from "@mui/icons-material/Memory";
import TimelineIcon from "@mui/icons-material/Timeline";
import LanIcon from "@mui/icons-material/Lan";
import StatusDot from "../components/StatusDot"; // default import
import { STATUS_COLORS } from "../data";

export default function Backends({ items }) {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Name");

  const filtered = useMemo(() => {
    const f = filter === "All" ? items : items.filter((b) => b.status === filter);
    switch (sortBy) {
      case "Queue":  return [...f].sort((a, b) => b.queue - a.queue);
      case "Qubits": return [...f].sort((a, b) => b.qubits - a.qubits);
      default:       return [...f].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [items, filter, sortBy]);

  return (
    <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Stack direction="row" alignItems="center" gap={1.2}>
          <ScienceIcon />
          <Typography variant="h6">Quantum Backends</Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select value={filter} label="Status" onChange={(e) => setFilter(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Busy">Busy</MenuItem>
              <MenuItem value="Maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              {["Name", "Queue", "Qubits"].map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Divider sx={{ mb: 1.5, opacity: 0.2 }} />

      <Grid container spacing={1.5}>
        {filtered.map((b, idx) => (
          <Grid key={`backend-${idx}`} item xs={12} md={6}>
            <Paper sx={{ p: 1.5, background: "rgba(255,255,255,0.06)" }} variant="outlined">
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" gap={1.2}>
                  <SensorsIcon fontSize="small" />
                  <Typography variant="subtitle1">
                    <StatusDot color={STATUS_COLORS[b.status]} />
                    {b.name}
                  </Typography>
                </Stack>
                <Chip
                  size="small"
                  label={b.status}
                  sx={{
                    bgcolor: `${STATUS_COLORS[b.status]}22`,
                    color: STATUS_COLORS[b.status],
                    border: "1px solid",
                    borderColor: STATUS_COLORS[b.status],
                  }}
                />
              </Stack>
              <Stack direction="row" gap={1} mt={1}>
                <Chip icon={<MemoryIcon />} label={`${b.qubits} qubits`} size="small" />
                <Chip icon={<TimelineIcon />} label={`Queue: ${b.queue}`} size="small" />
                <Chip icon={<LanIcon />} label={`v${b.version}`} size="small" />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
