import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { useUser } from "@clerk/clerk-react";
import { useAdminStore } from "./store/adminStore";
import ProfileModal from "./ProfileModal";
import AdminSidebar from "./layout/AdminSidebar";
import MobileTopBar from "./layout/MobileTopBar";
import { useAuth } from "../components/Auth/AuthProvider";

interface AdminLayoutProps {
  children: ReactNode;
}

const drawerWidth = 228;
const collapsedWidth = 72;

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, isLoaded: isUserLoaded } = useUser();
  const { profile: authProfile, loading: authLoading } = useAuth();

  const sidebarSearch = useAdminStore((s) => s.sidebarSearch);
  const setSidebarSearch = useAdminStore((s) => s.setSidebarSearch);
  const profile = useAdminStore((s) => s.profile);
  const updateProfile = useAdminStore((s) => s.updateProfile);
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
      { name: "Categories", icon: CategoryIcon, path: "/admin/categories" },
      { name: "Users", icon: PeopleIcon, path: "/admin/students" },
    ],
    []
  );

  const manageItems = useMemo(
    () => [{ name: "Settings", icon: SettingsIcon, path: "/admin/settings" }],
    []
  );

  useEffect(() => {
    if (authLoading || !isUserLoaded) return;
    if (!authProfile || !user) return;

    updateProfile({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      nickName: user.username ?? user.firstName ?? "",
      email: user.primaryEmailAddress?.emailAddress ?? "",
      role: authProfile.role === "admin" ? "Admin" : "User",
      profilePicture: user.imageUrl || undefined,
    });
  }, [authLoading, authProfile, isUserLoaded, updateProfile, user]);

  const isActivePath = useCallback((path: string) => location.pathname === path, [location.pathname]);

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
  }, [isMobile, setMobileOpen, setProfileModalOpen]);

  const handleQuickCreate = useCallback(() => {
    navigate("/admin/quizzes/create");
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [navigate, isMobile, setMobileOpen]);

  const profileLoaded = Boolean(
    !authLoading &&
    authProfile &&
    isUserLoaded &&
    profile.firstName &&
    profile.lastName &&
    profile.email
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#111827" }}>
      {isMobile && <MobileTopBar onMenuClick={toggleMobileOpen} />}

      {!isMobile && (
        <Box
          component="nav"
          sx={{
            width: sidebarCollapsed ? collapsedWidth : drawerWidth,
            flexShrink: 0,
            transition: "width 0.2s ease",
          }}
        >
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: sidebarCollapsed ? collapsedWidth : drawerWidth,
                borderRight: "1px solid #374151",
                transition: "width 0.2s ease",
                backgroundColor: "transparent",
                overflow: "visible",
              },
            }}
          >
            <AdminSidebar
              navItems={navItems}
              manageItems={manageItems}
              sidebarCollapsed={sidebarCollapsed}
              setSidebarCollapsed={setSidebarCollapsed}
              isMobile={isMobile}
              sidebarSearch={sidebarSearch}
              setSidebarSearch={setSidebarSearch}
              onNavigate={handleNavigation}
              onProfileClick={handleProfileClick}
              onQuickCreate={handleQuickCreate}
              profile={profile}
              profileLoaded={profileLoaded}
              drawerWidth={drawerWidth}
              collapsedWidth={collapsedWidth}
              isActivePath={isActivePath}
            />
          </Drawer>
        </Box>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth + 12,
              borderRight: "1px solid #374151",
              backgroundColor: "rgba(17, 24, 39, 0.95)",
              backdropFilter: "blur(10px)",
            },
          }}
        >
          <AdminSidebar
            navItems={navItems}
            manageItems={manageItems}
            sidebarCollapsed={sidebarCollapsed}
            setSidebarCollapsed={setSidebarCollapsed}
            isMobile={isMobile}
            sidebarSearch={sidebarSearch}
            setSidebarSearch={setSidebarSearch}
            onNavigate={handleNavigation}
            onProfileClick={handleProfileClick}
            onQuickCreate={handleQuickCreate}
            profile={profile}
            profileLoaded={profileLoaded}
            drawerWidth={drawerWidth}
            collapsedWidth={collapsedWidth}
            isActivePath={isActivePath}
          />
        </Drawer>
      )}

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
            md: `calc(100% - ${sidebarCollapsed ? collapsedWidth : drawerWidth}px)`,
          },
          transition: "width 0.3s",
        }}
      >
        {children}
      </Box>

      <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </Box>
  );
};

export default AdminLayout;
