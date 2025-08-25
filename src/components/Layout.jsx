import { useState } from "react";
import {
  AppBar, Toolbar, Typography, IconButton, Box, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem,
  OutlinedInput, Tooltip, Stack, Paper
} from "@mui/material";
import { NavLink, useLocation } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import HubIcon from "@mui/icons-material/Hub";
import MemoryIcon from "@mui/icons-material/Memory";
import ApiIcon from "@mui/icons-material/Api";
import MenuIcon from "@mui/icons-material/Menu";
import RefreshIcon from "@mui/icons-material/Refresh";
import ChatIcon from "@mui/icons-material/Chat";
import KeyIcon from "@mui/icons-material/Key";

import ApiKeyDialog from "./ApiKeyDialog";

const navItems = [
  { to: "/", label: "Dashboard", icon: <DashboardIcon /> },
  { to: "/backends", label: "Backends", icon: <ScienceIcon /> },
  { to: "/jobs", label: "Jobs", icon: <HubIcon /> },
  { to: "/sessions", label: "Sessions", icon: <MemoryIcon /> },
  { to: "/api", label: "API Explorer", icon: <ApiIcon /> },
];

export default function Layout({ children, onRefresh, onOpenAI, apiKeys, selectedKey, setSelectedKey, onAddKey }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [keyDialogOpen, setKeyDialogOpen] = useState(false);
  const location = useLocation();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage:
          "linear-gradient(135deg, rgba(12, 10, 30, 0.78), rgba(10, 20, 45, 0.78)), url('https://images.unsplash.com/photo-1527443224154-c4b8b3730f23?auto=format&fit=crop&w=2400&q=80')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        color: "#fff",
        display: "flex",
      }}
    >
      {/* Left Drawer */}
      <Drawer
  variant="permanent"
  sx={{
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 240,
      boxSizing: "border-box",
      bgcolor: "rgba(0,0,0,0.35)",
      color: "#fff",
      backdropFilter: "blur(8px)",
    },
  }}
>
        <Toolbar>
          <Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>IBM Quantum</Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>Made with Kishore and his team</Typography>
          </Stack>
        </Toolbar>
        <Divider sx={{ opacity: 0.2 }} />
        <List>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} style={{ textDecoration: "none", color: "inherit" }}>
              <ListItemButton selected={location.pathname === item.to}>
                <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </NavLink>
          ))}
        </List>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ p: 2 }}>
          <Paper sx={{ p: 1, background: "rgba(255, 255, 255, 0)" }}>
            <Stack direction="row" gap={1} alignItems="center" justifyContent="center">
              <AutoAwesomeIcon fontSize="small" />
              <Typography variant="caption">IBM Quantum Dashboard</Typography>
            </Stack>
          </Paper>
        </Box>
      </Drawer>

      {/* Right content */}
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: 30 } }}>
        <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: "blur(6px)" }}>
          <Toolbar>
            <IconButton sx={{ mr: 2, display: { md: "none" } }} onClick={() => setMobileOpen(!mobileOpen)}>
              <MenuIcon />
            </IconButton>

            <Stack sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                IBM Quantum Dashboard
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                Made with Kishore and his team
              </Typography>
            </Stack>

            {/* API Key dropdown (before Refresh) */}
            <FormControl size="small" sx={{ minWidth: 190, mr: 1.5 }} style={{backgroundColor:"white"}}>
             
              <Select
                value={selectedKey}
                label="IBM API Key"
                onChange={(e) => setSelectedKey(e.target.value)}
                input={<OutlinedInput label="IBM API Key" />}
                renderValue={(label) => {
                  const keyObj = apiKeys.find((k) => k.label === label);
                  const masked = keyObj?.key ? keyObj.key.slice(0, 5) + "•••••" + keyObj.key.slice(-3) : "—";
                  return `${label} (${masked})`;

                }}
              >
                {apiKeys.map((k) => (
                  <MenuItem key={k.label} value={k.label}>
                    <Stack direction="row" alignItems="center" gap={1}>
                      <KeyIcon fontSize="small" />
                      <Typography>{k.label}</Typography>
                    </Stack>
                  </MenuItem>
                ))}
                <Divider />
                <MenuItem onClick={() => setKeyDialogOpen(true)}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <AutoAwesomeIcon fontSize="small" />
                    <Typography>Add / Manage Keys…</Typography>
                  </Stack>
                </MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Refresh data">
              <IconButton color="inherit" onClick={onRefresh} sx={{ mr: 1 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="AI Assistant">
              <IconButton color="inherit" onClick={onOpenAI}>
                <ChatIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>

      <ApiKeyDialog open={keyDialogOpen} onClose={() => setKeyDialogOpen(false)} onSave={onAddKey} />
    </Box>
  )};