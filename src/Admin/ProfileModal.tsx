import { useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useAdminStore } from "./store/adminStore";
import { TextInput, TextArea, Button as CustomButton } from "../components/forms";

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
  const profile = useAdminStore(s => s.profile);
  const updateProfile = useAdminStore(s => s.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    profile.profilePicture || null
  );

  const handleSave = (values: typeof profile) => {
    updateProfile({
      ...values,
      profilePicture: avatarPreview || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setAvatarPreview(profile.profilePicture || null);
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
          bgcolor: "#1f2937",
          color: "white",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #374151",
          pb: 2,
        }}
      >
        <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
          User Profile
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

      <DialogContent sx={{ pt: 3 }}>
        <Formik
          initialValues={profile}
          validationSchema={validationSchema}
          onSubmit={handleSave}
          enableReinitialize
        >
          {({ values, isValid, dirty }) => (
            <Form>
              <Stack spacing={3}>
                {/* Avatar Section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    src={avatarPreview || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: "#9333ea",
                      fontSize: "3rem",
                      border: "3px solid",
                      borderColor: "#a855f7",
                    }}
                  >
                    {!avatarPreview &&
                      `${values.firstName[0]}${values.lastName[0]}`}
                  </Avatar>
                  {isEditing && (
                    <label className="cursor-pointer">
                      <CustomButton
                        type="button"
                        variant="outline"
                        as="span"
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

                <Divider sx={{ borderColor: "#374151" }} />

                {/* Profile Information */}
                <Stack spacing={2}>
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

                  <Divider sx={{ borderColor: "#374151" }} />

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
                    <Typography variant="body1">{values.email}</Typography>
                  )}

                  <Divider sx={{ borderColor: "#374151" }} />

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

                  <Divider sx={{ borderColor: "#374151" }} />

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
                          bgcolor: "#111827",
                          border: "1px solid #374151",
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
                  borderTop: "1px solid #374151",
                  px: 0,
                  py: 2,
                  gap: 1,
                  mt: 3,
                }}
              >
                {isEditing ? (
                  <>
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
                      disabled={!isValid || !dirty}
                    >
                      Save Changes
                    </CustomButton>
                  </>
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
