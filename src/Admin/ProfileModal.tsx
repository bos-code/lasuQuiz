import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
  Chip,
  Paper,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LogoutIcon from "@mui/icons-material/Logout";
import ShieldIcon from "@mui/icons-material/Shield";
import { useAdminStore } from "./store/adminStore";
import { TextInput, TextArea, Button as CustomButton } from "../components/forms";
import { useUser } from "@clerk/clerk-react";
import { useNotification } from "../components/NotificationProvider";
import { useAuth } from "../components/Auth/AuthProvider";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  role: Yup.string()
    .required("Role is required")
    .min(2, "Role must be at least 2 characters"),
  bio: Yup.string()
    .max(500, "Bio must be less than 500 characters"),
});

const ProfileModal = ({ open, onClose }: ProfileModalProps) => {
  const profile = useAdminStore((s) => s.profile);
  const updateProfile = useAdminStore((s) => s.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.profilePicture || null
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { user, isLoaded } = useUser();
  const notify = useNotification();
  const { signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!open || !isLoaded || !user) return;
    updateProfile({
      firstName: user.firstName || profile.firstName,
      lastName: user.lastName || profile.lastName,
      email: user.primaryEmailAddress?.emailAddress || profile.email,
      profilePicture: user.imageUrl || profile.profilePicture,
    });
    setAvatarPreview(user.imageUrl || null);
    setAvatarFile(null);
  }, [isLoaded, open, profile.email, profile.firstName, profile.lastName, profile.profilePicture, updateProfile, user]);

  const handleSave = async (values: typeof profile, setSubmitting: (s: boolean) => void) => {
    setSubmitting(true);
    try {
      if (user) {
        await user.update({
          firstName: values.firstName,
          lastName: values.lastName,
        });
        if (avatarFile) {
          await user.setProfileImage({ file: avatarFile });
        }
      }

      updateProfile({
        ...values,
        profilePicture: avatarPreview || user?.imageUrl || undefined,
      });

      notify({ message: "Profile updated successfully", severity: "success" });
      setIsEditing(false);
    } catch (error) {
      notify({ message: (error as Error).message, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setAvatarPreview(user?.imageUrl || profile.profilePicture || null);
    setAvatarFile(null);
    setIsEditing(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "linear-gradient(135deg, #0f172a 0%, #111827 50%, #0b1220 100%)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          borderRadius: "20px",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          pb: 2.5,
          px: 3,
        }}
      >
        <Typography
          variant="h6"
          component="span"
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            letterSpacing: 0.3,
          }}
        >
          <ShieldIcon fontSize="small" className="text-purple-300" />
          Admin Profile
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#9ca3af",
            "&:hover": { bgcolor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 3 }}>
        <Formik
          initialValues={profile}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => handleSave(values, setSubmitting)}
          enableReinitialize
        >
          {({ values, isValid, dirty, isSubmitting }) => (
            <Form>
              <Stack spacing={3}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Avatar
                    src={avatarPreview || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "#9333ea",
                      fontSize: "3rem",
                      border: "3px solid rgba(168,85,247,0.5)",
                      boxShadow: "0 15px 40px rgba(147,51,234,0.35)",
                    }}
                  >
                    {!avatarPreview && values.firstName && values.lastName &&
                      `${values.firstName[0]}${values.lastName[0]}`}
                  </Avatar>
                  {isEditing && (
                    <label className="cursor-pointer">
                      <CustomButton
                        type="button"
                        variant="outline"
                        as="span"
                        className="border-white/20 text-white"
                      >
                        <CloudUploadIcon className="mr-2" style={{ fontSize: 20 }} />
                        Upload Photo
                      </CustomButton>
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  )}
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                {/* Profile Information */}
                <Stack spacing={2.5}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ color: "#a855f7" }} />
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                      Full Name
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <TextInput
                        name="firstName"
                        label="First Name"
                        placeholder="Enter first name"
                      />
                      <TextInput
                        name="lastName"
                        label="Last Name"
                        placeholder="Enter last name"
                      />
                    </div>
                  ) : (
                    <Typography variant="h6" sx={{ fontWeight: "medium" }}>
                      {values.firstName} {values.lastName}
                    </Typography>
                  )}

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <EmailIcon sx={{ color: "#a855f7" }} />
                  <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                    Email Address
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextInput
                      name="email"
                      label="Email"
                      type="email"
                      placeholder="Enter email address"
                    />
                  ) : (
                    <Typography
                      variant="body1"
                      sx={{ maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}
                      title={values.email}
                    >
                      {values.email}
                    </Typography>
                  )}

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WorkIcon sx={{ color: "#a855f7" }} />
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af" }}>
                      Role
                    </Typography>
                  </Box>
                  {isEditing ? (
                    <TextInput
                      name="role"
                      label="Role"
                      placeholder="Enter your role"
                    />
                  ) : (
                    <Chip
                      label={values.role}
                      sx={{
                        bgcolor: "#9333ea",
                        color: "white",
                        fontWeight: "medium",
                      }}
                    />
                  )}

                  <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                  <Box>
                    <Typography variant="subtitle2" sx={{ color: "#9ca3af", mb: 1 }}>
                      Bio
                    </Typography>
                    {isEditing ? (
                      <TextArea
                        name="bio"
                        label=""
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "gray.300",
                        }}
                      >
                        <Typography variant="body2">
                          {values.bio || "No bio available"}
                        </Typography>
                      </Paper>
                    )}
                  </Box>
                </Stack>
              </Stack>

              <DialogActions
                sx={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  px: 0,
                  py: 2,
                  gap: 1,
                  mt: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Secure sign-out powered by Clerk">
                  <span>
                    <CustomButton
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        setSigningOut(true);
                        try {
                          await signOut();
                          notify({ message: "Signed out successfully", severity: "success" });
                        } catch (error) {
                          notify({ message: (error as Error).message, severity: "error" });
                        } finally {
                          setSigningOut(false);
                        }
                      }}
                      disabled={signingOut}
                      className="text-red-300 border-red-300/40 hover:border-red-300"
                    >
                      <LogoutIcon className="mr-2" fontSize="small" />
                      {signingOut ? "Signing out..." : "Sign out"}
                    </CustomButton>
                  </span>
                </Tooltip>

                {isEditing ? (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <CustomButton
                      type="button"
                      variant="secondary"
                      onClick={handleCancel}
                    >
                      Cancel
                    </CustomButton>
                    <CustomButton
                      type="submit"
                      variant="primary"
                      disabled={!isValid || !dirty || isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </CustomButton>
                  </Box>
                ) : (
                  <CustomButton
                    type="button"
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                  >
                    <EditIcon className="mr-2" />
                    Edit Profile
                  </CustomButton>
                )}
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
