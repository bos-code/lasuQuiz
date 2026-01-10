import { memo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
  Chip,
  Paper,
  LinearProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuizIcon from "@mui/icons-material/Quiz";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { colors } from "../theme/colors";

interface User {
  id: string;
  name: string;
  subject: string;
  score: number;
  avatar: string;
  class: string;
  quizzesTaken: number;
  averageScore: number;
  lastActive: string;
}

interface UserDetailModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailModal = memo(
  ({ open, onClose, user }: UserDetailModalProps) => {
    const getInitials = useCallback((name: string) => {
      const parts = name.split(" ");
      return parts.length >= 2
        ? `${parts[0][0]}${parts[1][0]}`
        : name[0].toUpperCase();
    }, []);

    const getScoreColor = useCallback((score: number) => {
      if (score >= 90) return colors.success[500];
      if (score >= 70) return colors.info[500];
      if (score >= 50) return colors.warning[500];
      return colors.error[500];
    }, []);

    if (!user) return null;

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: colors.gray[800],
            color: colors.gray[50],
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px solid ${colors.gray[700]}`,
            pb: 2,
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            User Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{
              color: colors.gray[400],
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            {/* Avatar and Basic Info */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: colors.purple[600],
                  fontSize: "3rem",
                  border: "3px solid",
                  borderColor: colors.purple[500],
                }}
              >
                {user.avatar !== "👤" ? user.avatar : getInitials(user.name)}
              </Avatar>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
                  {user.name}
                </Typography>
                <Chip
                  label={user.class}
                  icon={<SchoolIcon />}
                  sx={{
                    bgcolor: "#9333ea",
                    color: "white",
                    fontWeight: "medium",
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ borderColor: colors.gray[700] }} />

            {/* Stats Grid */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Box>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: colors.gray[900],
                    border: `1px solid ${colors.gray[700]}`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <EmojiEventsIcon
                      sx={{ color: colors.warning[400], fontSize: "1.5rem" }}
                    />
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                      Total Score
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "bold", color: colors.warning[400] }}
                  >
                    {user.score}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: colors.gray[900],
                    border: `1px solid ${colors.gray[700]}`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <TrendingUpIcon
                      sx={{
                        color: getScoreColor(user.averageScore),
                        fontSize: "1.5rem",
                      }}
                    />
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                      Average Score
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      color: getScoreColor(user.averageScore),
                    }}
                  >
                    {user.averageScore}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={user.averageScore}
                    sx={{
                      mt: 1,
                      height: 8,
                      borderRadius: 1,
                      bgcolor: colors.gray[700],
                      "& .MuiLinearProgress-bar": {
                        bgcolor: getScoreColor(user.averageScore),
                      },
                    }}
                  />
                </Paper>
              </Box>

              <Box>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: colors.gray[900],
                    border: `1px solid ${colors.gray[700]}`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <QuizIcon
                      sx={{ color: colors.purple[500], fontSize: "1.5rem" }}
                    />
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                      Quizzes Taken
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    {user.quizzesTaken}
                  </Typography>
                </Paper>
              </Box>

              <Box>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: colors.gray[900],
                    border: `1px solid ${colors.gray[700]}`,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                    <AccessTimeIcon
                      sx={{ color: colors.info[500], fontSize: "1.5rem" }}
                    />
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                      Last Active
                    </Typography>
                  </Stack>
                  <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                    {user.lastActive}
                  </Typography>
                </Paper>
              </Box>
            </Box>

            <Divider sx={{ borderColor: colors.gray[700] }} />

            {/* Additional Information */}
            <Stack spacing={2}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <SchoolIcon sx={{ color: colors.purple[500] }} />
                <Typography
                  variant="subtitle2"
                  sx={{ color: colors.gray[400] }}
                >
                  Subject
                </Typography>
              </Box>
              <Chip
                label={user.subject}
                sx={{
                  bgcolor: colors.purple[600],
                  color: colors.gray[50],
                  fontWeight: "medium",
                  width: "fit-content",
                }}
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            borderTop: `1px solid ${colors.gray[700]}`,
            px: 3,
            py: 2,
          }}
        >
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              bgcolor: colors.purple[600],
              "&:hover": { bgcolor: colors.purple[700] },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

UserDetailModal.displayName = "UserDetailModal";

export default UserDetailModal;
