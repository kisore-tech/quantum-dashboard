import { Box } from "@mui/material";

export default function StatusDot({ color }) {
  return (
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        bgcolor: color,
        display: "inline-block",
        mr: 1,
        boxShadow: `0 0 6px ${color}`,
      }}
    />
  );
}
