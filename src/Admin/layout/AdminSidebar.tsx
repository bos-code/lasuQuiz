import type { ReactElement } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Collapse,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

type NavItem = {
  name: string;
  path: string;
  icon: React.ElementType;
};

type ProfileInfo = {
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
};

type AdminSidebarProps = {
  navItems: NavItem[];
  manageItems: NavItem[];
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  sidebarSearch: string;
  setSidebarSearch: (value: string) => void;
  onNavigate: (path: string) => void;
  onProfileClick: () => void;
  onQuickCreate: () => void;
  profile: ProfileInfo;
  profileLoaded: boolean;
  drawerWidth: number;
  collapsedWidth: number;
  isActivePath: (path: string) => boolean;
};

const NavSection = ({
  items,
  sidebarCollapsed,
  isMobile,
  onNavigate,
  activeMatcher,
}: {
  items: NavItem[];
  sidebarCollapsed: boolean;
  isMobile: boolean;
  onNavigate: (path: string) => void;
  activeMatcher: (path: string) => boolean;
}): ReactElement => (
  <List>
    {items.map((item) => {
      const IconComponent = item.icon;
      const active = activeMatcher(item.path);
      const button = (
        <ListItemButton
          onClick={() => onNavigate(item.path)}
          aria-current={active ? "page" : undefined}
          sx={{
            position: "relative",
            borderRadius: "0.75rem",
            bgcolor: active ? "rgba(147, 51, 234, 0.2)" : "transparent",
            color: active ? "white" : "#d1d5db",
            "&:hover": {
              bgcolor: active ? "rgba(147, 51, 234, 0.28)" : "rgba(255, 255, 255, 0.06)",
              transform: "translateX(2px)",
            },
            "&:focus-visible": {
              outline: "2px solid rgba(94, 234, 212, 0.7)",
              outlineOffset: 2,
            },
            "&:active": { transform: "translateX(0)", opacity: 0.95 },
            py: 1.35,
            px: sidebarCollapsed && !isMobile ? 1.25 : 2,
            transition: "all 0.18s ease",
            overflow: "hidden",
            backdropFilter: active ? "blur(4px)" : "none",
            "&::before": {
              content: '""',
              position: "absolute",
              left: 8,
              top: 10,
              bottom: 10,
              width: 4,
              borderRadius: 999,
              background: active ? "linear-gradient(180deg,#8b5cf6,#22d3ee)" : "rgba(255,255,255,0.06)",
              transition: "opacity 0.18s ease, transform 0.18s ease, background 0.18s ease",
              opacity: active ? 1 : (sidebarCollapsed && !isMobile ? 0 : 0.25),
              transform: active ? "scaleY(1)" : "scaleY(0)",
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: sidebarCollapsed && !isMobile ? 0 : 40,
              color: "inherit",
              transition: "min-width 0.18s ease",
            }}
          >
            <IconComponent />
          </ListItemIcon>
          <Collapse in={!sidebarCollapsed || isMobile} orientation="horizontal">
            <ListItemText
              primary={item.name}
              primaryTypographyProps={{
                fontWeight: active ? "medium" : "normal",
                fontSize: "0.9rem",
              }}
            />
          </Collapse>
        </ListItemButton>
      );
      return (
        <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
          {sidebarCollapsed && !isMobile ? (
            <Tooltip title={item.name} placement="right">
              {button}
            </Tooltip>
          ) : (
            button
          )}
        </ListItem>
      );
    })}
  </List>
);

const ProfileBlock = ({
  profile,
  profileLoaded,
  onClick,
  sidebarCollapsed,
  isMobile,
}: {
  profile: ProfileInfo;
  profileLoaded: boolean;
  onClick: () => void;
  sidebarCollapsed: boolean;
  isMobile: boolean;
}) => (
  <ListItemButton
    onClick={onClick}
    sx={{
      borderRadius: "0.5rem",
      "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
      p: sidebarCollapsed && !isMobile ? 1.25 : 1.5,
      justifyContent: sidebarCollapsed && !isMobile ? "center" : "flex-start",
    }}
  >
    <Box
      sx={{
        p: 0.35,
        borderRadius: "999px",
        background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
        display: "inline-flex",
      }}
    >
      {profileLoaded ? (
        <Avatar
          src={profile.profilePicture}
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#111827",
            fontSize: "1rem",
          }}
        >
          {!profile.profilePicture && `${profile.firstName[0]}${profile.lastName[0]}`}
        </Avatar>
      ) : (
        <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: "#1f2937" }} />
      )}
    </Box>
    <Collapse in={!sidebarCollapsed || isMobile} orientation="horizontal">
      <Box sx={{ ml: 2, minWidth: 0, flex: 1 }}>
        {profileLoaded ? (
          <>
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
              title={profile.email}
            >
              {profile.email}
            </Typography>
          </>
        ) : (
          <>
            <Skeleton variant="text" width="70%" height={18} sx={{ bgcolor: "#1f2937" }} />
            <Skeleton variant="text" width="55%" height={14} sx={{ bgcolor: "#111827" }} />
          </>
        )}
      </Box>
    </Collapse>
  </ListItemButton>
);

const GradientChrome = () => (
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(14, 165, 233, 0.12), transparent 45%)",
      opacity: 0.8,
      zIndex: 0,
    }}
  />
);

const SidebarHeader = ({
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobile,
}: {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}) => (
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
      {!sidebarCollapsed && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            transition: "opacity 0.18s ease",
          }}
        >
          Quizzy
        </Typography>
      )}
    </Box>
    {!isMobile && (
      <IconButton
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        sx={{
          color: "#9ca3af",
          "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
          transition: "transform 0.22s ease",
          transform: sidebarCollapsed ? "translateX(4px)" : "translateX(0)",
        }}
        size="small"
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeftIcon
          sx={{
            transform: sidebarCollapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.22s ease",
          }}
        />
      </IconButton>
    )}
  </Box>
);

const AdminSidebar = ({
  navItems,
  manageItems,
  sidebarCollapsed,
  setSidebarCollapsed,
  isMobile,
  sidebarSearch,
  setSidebarSearch,
  onNavigate,
  onProfileClick,
  onQuickCreate,
  profile,
  profileLoaded,
  drawerWidth,
  collapsedWidth,
  isActivePath,
}: AdminSidebarProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "linear-gradient(180deg, #0f172a 0%, #0b1220 40%, #0f172a 100%)",
        color: "white",
        position: "relative",
        transition: "width 0.22s ease, box-shadow 0.22s ease",
        boxShadow: sidebarCollapsed ? "0 10px 30px rgba(0,0,0,0.28)" : "0 20px 40px rgba(0,0,0,0.35)",
        width: sidebarCollapsed && !isMobile ? collapsedWidth : drawerWidth,
        borderRight: "1px solid rgba(148, 163, 184, 0.16)",
        overflow: "hidden",
      }}
      onMouseEnter={() => !isMobile && sidebarCollapsed && setSidebarCollapsed(false)}
      onMouseLeave={() => !isMobile && !sidebarCollapsed && setSidebarCollapsed(true)}
    >
      <GradientChrome />
      <Box sx={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
        <SidebarHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} isMobile={isMobile} />

        {/* Search Section */}
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #374151",
            display: sidebarCollapsed && !isMobile ? "none" : "block",
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            value={sidebarSearch}
            onChange={(e) => setSidebarSearch(e.target.value)}
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

        {/* Quick Action */}
        <Box
          sx={{
            px: sidebarCollapsed && !isMobile ? 1 : 2,
            pb: 1.5,
            display: sidebarCollapsed && !isMobile ? "none" : "block",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            onClick={onQuickCreate}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.9rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(120deg, #8b5cf6, #22d3ee)",
              boxShadow: "0 12px 30px rgba(34, 211, 238, 0.25)",
              "&:hover": { background: "linear-gradient(120deg, #7c3aed, #0ea5e9)" },
            }}
          >
            New Quiz
          </Button>
        </Box>

        {/* Navigation Items */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: sidebarCollapsed && !isMobile ? 0.5 : 1,
            transition: "padding 0.2s ease",
          }}
        >
          {!sidebarCollapsed && !isMobile && (
            <Typography
              variant="caption"
              sx={{
                color: "#94a3b8",
                px: 1.5,
                pb: 1,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Navigation
            </Typography>
          )}
          <NavSection
            items={navItems}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            onNavigate={onNavigate}
            activeMatcher={isActivePath}
          />
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
                letterSpacing: "0.04em",
              }}
            >
              Manage
            </Typography>
          </Collapse>
          <NavSection
            items={manageItems}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            onNavigate={onNavigate}
            activeMatcher={isActivePath}
          />
        </Box>

        <Divider sx={{ borderColor: "#374151" }} />

        {/* User Profile Section */}
        <Box sx={{ p: 2 }}>
          <ProfileBlock
            profile={profile}
            profileLoaded={profileLoaded}
            onClick={onProfileClick}
            sidebarCollapsed={sidebarCollapsed}
            isMobile={isMobile}
          />
        </Box>
        <Box
          sx={{
            px: 2,
            pb: 2.5,
            display: sidebarCollapsed && !isMobile ? "none" : "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "#94a3b8",
            fontSize: "0.75rem",
          }}
        >
          <span>v1.0</span>
          <div className="flex justify-center items-center gap-1"> 
            <div className="flex animate-ping duration-1000 transition-all delay-1000 items-center justify-center gap-1">
            <Box
              component="span"
              sx={{
                width: 8,
                height: 8,
                borderRadius: "999px",
                bgcolor: "#22c55e",
                boxShadow: "0 0 10px rgba(34,197,94,0.6)",
              }}
            />
          </div>
          <span>Live</span>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSidebar;
