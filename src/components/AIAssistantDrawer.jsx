import { useState } from "react";
import {
  Drawer, Box, Avatar, Typography, Divider, TextField, Button, Stack
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function AIAssistantDrawer({ open, onClose, data }) {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I’m your Quantum AI Assistant. Ask me about backends, jobs, or sessions." },
  ]);
  const [input, setInput] = useState("");

  const pushMessage = (role, text) => setMessages((m) => [...m, { role, text }]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    pushMessage("user", userMsg);

    const lower = userMsg.toLowerCase();
    let reply =
      "I can summarize backends, jobs, and sessions. Try: “summarize backends”, “show running jobs”, or “active sessions”.";
    if (lower.includes("backend")) {
      const available = data.backends.filter((b) => b.status === "Available").map((b) => b.name).join(", ");
      const reply = `Currently available backends: ${available || "none"}. Total: ${data.backends.length}.`;

    } else if (lower.includes("job")) {
      const running = data.jobs.filter((j) => j.status === "Running").map((j) => j.id).join(", ");
     const reply = running 
  ? `Running jobs: ${running}.` 
  : "No jobs are running right now.";

    } else if (lower.includes("session")) {
      const active = data.sessions.filter((s) => s.status === "Active").length;
     const reply = `You have ${active} active session${active === 1 ? "" : "s"}.`;

    }
    setTimeout(() => pushMessage("assistant", reply), 400);
    setInput("");
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 380, height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider", display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ bgcolor: "secondary.main" }}>
            <AutoAwesomeIcon />
          </Avatar>
          <Typography variant="h6">AI Assistant</Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1 }}>
          {messages.map((m, i) => (
            <Box
              key={i}
              sx={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                bgcolor: m.role === "user" ? "primary.main" : "background.paper",
                color: m.role === "user" ? "primary.contrastText" : "text.primary",
                px: 1.5, py: 1, borderRadius: 2, maxWidth: "80%", boxShadow: 2,
              }}
            >
              <Typography variant="body2">{m.text}</Typography>
            </Box>
          ))}
        </Box>
        <Divider />
        <Box sx={{ p: 1.5, display: "flex", gap: 1 }}>
          <TextField
            fullWidth size="small" placeholder="Ask about backends, jobs, sessions..."
            value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button variant="contained" onClick={handleSend}>Send</Button>
        </Box>
      </Box>
    </Drawer>
  );
}