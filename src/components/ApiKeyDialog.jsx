import { useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Stack, Typography
} from "@mui/material";
import KeyIcon from "@mui/icons-material/Key";

export default function ApiKeyDialog({ open, onClose, onSave }) {
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");

  const handleSave = () => {
    if (!label || !key) return;
    onSave({ label, key });
    setLabel(""); setKey("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" gap={1}>
          <KeyIcon /> Add IBM API Key
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Stack gap={2}>
          <TextField label="Key label (e.g., Team Key)" value={label} onChange={(e) => setLabel(e.target.value)} fullWidth />
          <TextField label="API Key" type="password" value={key} onChange={(e) => setKey(e.target.value)} fullWidth />
          <Typography variant="caption" color="text.secondary">
            🔒 Demo-only: keys are stored in local state. Don’t put real secrets in front-end code.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save Key</Button>
      </DialogActions>
    </Dialog>
  );
}