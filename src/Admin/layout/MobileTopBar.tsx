import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

type MobileTopBarProps = {
  onMenuClick: () => void;
};

const MobileTopBar = ({ onMenuClick }: MobileTopBarProps) => (
  <AppBar
    position="fixed"
    sx={{
      bgcolor: "#1f2937",
      borderBottom: "1px solid #374151",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <Toolbar>
      <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
        <MenuIcon />
      </IconButton>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flex: 1,
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.125rem",
          }}
        >
          Q
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Quizzy
        </Typography>
      </Box>
    </Toolbar>
  </AppBar>
);

export default MobileTopBar;
