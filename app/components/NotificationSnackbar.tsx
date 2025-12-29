import { Snackbar, Alert } from "@mui/material";
import { useApp } from "../context/AppContext";

export function NotificationSnackbar() {
  const { state, clearMessages } = useApp();
  const { error, success } = state;

  const isOpen = !!error || !!success;
  const message = error || success || "";
  const severity: "error" | "success" = error ? "error" : "success";

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    clearMessages();
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={error ? 6000 : 4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

