import { Paper, Stack, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Badge } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ApiIcon from "@mui/icons-material/Api";

export default function ApiExplorer({ endpoints }) {
  return (
    <Paper sx={{ p: 2, backdropFilter: "blur(8px)", background: "rgba(255, 255, 255, 1)" }}>
      <Stack direction="row" alignItems="center" gap={1.2} mb={1.5}>
        <ApiIcon />
        <Typography variant="h6">API Endpoints</Typography>
      </Stack>
      <List dense>
        {endpoints.map((e) => (
          <ListItem key={e.path} sx={{ borderBottom: "1px dashed rgba(255,255,255,0.1)" }}>
            <ListItemIcon>
              <Badge badgeContent={e.method} color={e.method === "POST" ? "secondary" : "primary"} anchorOrigin={{ vertical: "top", horizontal: "left" }}>
                <AutoAwesomeIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary={
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                    {e.path}
                  </Typography>
                  <Chip size="small" label={e.method} />
                </Stack>
              }
              secondary={e.desc}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}