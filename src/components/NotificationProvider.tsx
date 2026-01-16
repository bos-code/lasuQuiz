import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { type AlertColor } from "@mui/material/Alert";

type NotifyOptions = {
  message: string;
  severity?: AlertColor;
  durationMs?: number;
};

type NotificationContextValue = {
  notify: (options: NotifyOptions) => void;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Required<NotifyOptions>>({
    message: "",
    severity: "info",
    durationMs: 3000,
  });

  const notify = useCallback((opts: NotifyOptions) => {
    setOptions((prev) => ({
      message: opts.message,
      severity: opts.severity ?? "info",
      durationMs: opts.durationMs ?? prev.durationMs,
    }));
    setOpen(true);
  }, []);

  const handleClose = useCallback((_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={options.durationMs}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        className="pointer-events-none"
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={options.severity}
          onClose={handleClose}
          className="pointer-events-auto shadow-xl rounded-lg backdrop-blur bg-opacity-90"
          sx={{ minWidth: 280 }}
        >
          {options.message}
        </MuiAlert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return ctx.notify;
};
