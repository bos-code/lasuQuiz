import type { ReactNode } from "react";
import { useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminStore } from "./store/adminStore";
import {
  Avatar,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  TextField,
  InputAdornment,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ProfileModal from "./ProfileModal";

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 256;

const AdminLayout = ({ children }: AdminLayoutProps) => {
  console.count("AdminLayout render");

  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Using individual selectors to avoid TypeScript inference issues
  const sidebarSearch = useAdminStore((s) => s.sidebarSearch);
  const setSidebarSearch = useAdminStore((s) => s.setSidebarSearch);
  const profile = useAdminStore((s) => s.profile);
  const mobileOpen = useAdminStore((s) => s.mobileOpen);
  const setMobileOpen = useAdminStore((s) => s.setMobileOpen);
  const toggleMobileOpen = useAdminStore((s) => s.toggleMobileOpen);
  const sidebarCollapsed = useAdminStore((s) => s.sidebarCollapsed);
  const setSidebarCollapsed = useAdminStore((s) => s.setSidebarCollapsed);
  const profileModalOpen = useAdminStore((s) => s.profileModalOpen);
  const setProfileModalOpen = useAdminStore((s) => s.setProfileModalOpen);

  const navItems = useMemo(
    () => [
      { name: "Dashboard", icon: DashboardIcon, path: "/admin" },
      { name: "Quizzes", icon: MenuBookIcon, path: "/admin/quizzes" },
      { name: "Events", icon: EventIcon, path: "/admin/events" },
      { name: "Students", icon: PeopleIcon, path: "/admin/students" },
    ],
    []
  );

  const manageItems = useMemo(
    () => [{ name: "Settings", icon: SettingsIcon, path: "/admin/settings" }],
    []
  );

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const handleDrawerToggle = useCallback(() => {
    toggleMobileOpen();
  }, [toggleMobileOpen]);

  const handleDrawerClose = useCallback(() => {
    setMobileOpen(false);
  }, [setMobileOpen]);

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
      if (isMobile) {
        setMobileOpen(false);
      }
    },
    [navigate, isMobile, setMobileOpen]
  );

  const handleProfileClick = useCallback(() => {
    setProfileModalOpen(true);
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [isMobile, setProfileModalOpen, setMobileOpen]);

  const handleSidebarSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSidebarSearch(e.target.value);
    },
    [setSidebarSearch]
  );

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#1f2937",
        color: "white",
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #374151",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              bgcolor: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
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
              display: { xs: sidebarCollapsed ? "none" : "block", md: "block" },
            }}
          >
            Quizzy
          </Typography>
        </Box>
        {!isMobile && (
          <IconButton
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            sx={{
              color: "#9ca3af",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <ChevronLeftIcon
              sx={{
                transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Search Section */}
      <Box sx={{ p: 2, borderBottom: "1px solid #374151" }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search"
          value={sidebarSearch}
          onChange={handleSidebarSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9ca3af" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#374151",
              color: "white",
              "& fieldset": { borderColor: "#4b5563" },
              "&:hover fieldset": { borderColor: "#6b7280" },
              "&.Mui-focused fieldset": { borderColor: "#9333ea" },
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#9ca3af",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* Navigation Items */}
      <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
        <List>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: "0.5rem",
                    bgcolor: active ? "#9333ea" : "transparent",
                    color: active ? "white" : "#d1d5db",
                    "&:hover": {
                      bgcolor: active ? "#7e22ce" : "rgba(255, 255, 255, 0.1)",
                    },
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                    <IconComponent />
                  </ListItemIcon>
                  <Collapse
                    in={!sidebarCollapsed || isMobile}
                    orientation="horizontal"
                  >
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontWeight: active ? "medium" : "normal",
                        fontSize: "0.875rem",
                      }}
                    />
                  </Collapse>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: "#374151" }} />

      {/* Manage Section */}
      <Box sx={{ p: 1 }}>
        <Collapse in={!sidebarCollapsed || isMobile} orientation="horizontal">
          <Typography
            variant="caption"
            sx={{
              color: "#9ca3af",
              fontWeight: "semibold",
              textTransform: "uppercase",
              px: 2,
              py: 1,
              display: "block",
            }}
          >
            Manage
          </Typography>
        </Collapse>
        <List>
          {manageItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            return (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: "0.5rem",
                    bgcolor: active ? "#9333ea" : "transparent",
                    color: active ? "white" : "#d1d5db",
                    "&:hover": {
                      bgcolor: active ? "#7e22ce" : "rgba(255, 255, 255, 0.1)",
                    },
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                    <IconComponent />
                  </ListItemIcon>
                  <Collapse
                    in={!sidebarCollapsed || isMobile}
                    orientation="horizontal"
                  >
                    <ListItemText
                      primary={item.name}
                      primaryTypographyProps={{
                        fontWeight: active ? "medium" : "normal",
                        fontSize: "0.875rem",
                      }}
                    />
                  </Collapse>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: "#374151" }} />

      {/* User Profile Section */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleProfileClick}
          sx={{
            borderRadius: "0.5rem",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            p: 1.5,
          }}
        >
          <Avatar
            src={profile.profilePicture}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "#9333ea",
              fontSize: "1rem",
            }}
          >
            {!profile.profilePicture &&
              `${profile.firstName[0]}${profile.lastName[0]}`}
          </Avatar>
          <Collapse in={!sidebarCollapsed || isMobile} orientation="horizontal">
            <Box sx={{ ml: 2, minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "white",
                  fontWeight: "medium",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {profile.firstName} {profile.lastName}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "#9ca3af",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "block",
                }}
              >
                {profile.email}
              </Typography>
            </Box>
          </Collapse>
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#111827" }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            bgcolor: "#1f2937",
            borderBottom: "1px solid #374151",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
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
                  background:
                    "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
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
                  background:
                    "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Quizzy
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: sidebarCollapsed ? 80 : drawerWidth,
            flexShrink: 0,
            transition: "width 0.3s",
          }}
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: sidebarCollapsed ? 80 : drawerWidth,
                borderRight: "1px solid #374151",
                transition: "width 0.3s",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid #374151",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          mt: { xs: "64px", md: 0 },
          width: {
            xs: "100%",
            md: `calc(100% - ${sidebarCollapsed ? 80 : drawerWidth}px)`,
          },
          transition: "width 0.3s",
        }}
      >
        {children}
      </Box>

      {/* Profile Modal */}
      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </Box>
  );
};

export default AdminLayout;
