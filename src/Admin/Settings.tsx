import { useAdminStore } from "./store/adminStore";
import { useState, useEffect } from "react";
// import { shallow } from "zustand/shallow";
import { useNotification } from "../components/NotificationProvider";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import PaletteIcon from "@mui/icons-material/Palette";?
import LanguageIcon from "@mui/icons-material/Language";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness6Icon from "@mui/icons-material/Brightness6";
import ComputerIcon from "@mui/icons-material/Computer";
import CheckIcon from "@mui/icons-material/Check";

const Settings = () => {
  const notify = useNotification();
  const headerSearch = useAdminStore((s) => s.headerSearch);
  // const setHeaderSearch = useAdminStore(s => s.setHeaderSearch);
  const activeSettingsTab = useAdminStore((s) => s.activeSettingsTab);
  const setActiveSettingsTab = useAdminStore((s) => s.setActiveSettingsTab);
  const profile = useAdminStore((s) => s.profile);
  const updateProfile = useAdminStore((s) => s.updateProfile);
  const account = useAdminStore((s) => s.account);
  const updateAccount = useAdminStore((s) => s.updateAccount);
  const toggleGoogleConnection = useAdminStore((s) => s.toggleGoogleConnection);
  const appearance = useAdminStore((s) => s.appearance);
  const updateAppearance = useAdminStore((s) => s.updateAppearance);

  const [formData, setFormData] = useState(profile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync form data with store when profile changes
  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const settingsTabs: (
    | "Profile"
    | "Account"
    | "Notifications"
    | "Appearance"
    | "Privacy"
    | "Billing"
  )[] = [
    "Profile",
    "Account",
    "Notifications",
    "Appearance",
    "Privacy",
    "Billing",
  ];

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (
    field: keyof typeof passwordData,
    value: string
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    updateProfile(formData);
    notify({ message: "Profile updated successfully!", severity: "success" });
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify({ message: "New passwords do not match!", severity: "warning" });
      return;
    }
    updateAccount({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    });
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    notify({ message: "Password updated successfully!", severity: "success" });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      notify({
        message: "Account deletion would be processed here.",
        severity: "info",
      });
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <SearchIcon
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            fontSize="small"
          />
          <input
            type="text"
            placeholder="Search..."
            value={headerSearch}
            onChange={handleHeaderSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button className="ml-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
          <AddIcon fontSize="small" />
          <span>Create Quiz</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Settings Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-700">
            {settingsTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSettingsTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeSettingsTab === tab
                    ? "border-purple-600 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Profile Tab Content */}
          {activeSettingsTab === "Profile" && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-2">
                  Profile Information
                </h2>
                <p className="text-gray-400 text-sm">
                  Update your profile information and public details
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Profile Picture Section */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <PersonIcon className="text-4xl text-gray-400" />
                    )}
                  </div>
                  <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <CloudUploadIcon fontSize="small" />
                    <span>Change Photo</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab Content */}
          {activeSettingsTab === "Account" && (
            <div className="space-y-6">
              {/* Account Security Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Account Security
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Update your password and security settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      placeholder="Enter current password"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleUpdatePassword}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              {/* Connected Accounts Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Connected Accounts
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Connect your account to other services
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                    <div className="flex items-center gap-3">
                      <GoogleIcon className="text-2xl text-blue-400" />
                      <div>
                        <p className="text-white font-medium">
                          Connect your Google account
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleGoogleConnection}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        account.googleConnected
                          ? "bg-gray-600 hover:bg-gray-500 text-white"
                          : "bg-purple-600 hover:bg-purple-700 text-white"
                      }`}
                    >
                      {account.googleConnected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-red-400 mb-2">
                    Danger Zone
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Irreversible actions for your account
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      Delete Account
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Once you delete your account, there is no going back. All
                      your data will be permanently removed.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="ml-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <DeleteOutlineIcon fontSize="small" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab Content */}
          {activeSettingsTab === "Appearance" && (
            <div className="space-y-6">
              {/* Theme Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">Theme</h2>
                  <p className="text-gray-400 text-sm">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex gap-4">
                  {(["System", "Light", "Dark"] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateAppearance({ theme })}
                      className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
                        appearance.theme === theme
                          ? "border-purple-600 bg-purple-600/10"
                          : "border-gray-600 bg-gray-700/50 hover:border-gray-500"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        {theme === "System" && (
                          <ComputerIcon className="text-2xl text-gray-300" />
                        )}
                        {theme === "Light" && (
                          <Brightness6Icon className="text-2xl text-gray-300" />
                        )}
                        {theme === "Dark" && (
                          <Brightness4Icon className="text-2xl text-gray-300" />
                        )}
                        <span className="text-white font-medium">{theme}</span>
                        {appearance.theme === theme && (
                          <CheckIcon
                            className="text-purple-400"
                            fontSize="small"
                          />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Language
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Select your preferred language
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LanguageIcon className="text-2xl text-gray-400" />
                    <span className="text-white font-medium">
                      {appearance.language}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                    Change Language
                  </button>
                </div>
              </div>

              {/* Font Size Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Font Size
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Adjust the font size to your preference
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TextFieldsIcon className="text-2xl text-gray-400" />
                    <span className="text-white font-medium">
                      {appearance.fontSize}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
                    Change Font Size
                  </button>
                </div>
              </div>

              {/* Color Scheme Section */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-2">
                    Color Scheme
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Choose your preferred color scheme
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(
                    [
                      "Purple",
                      "Blue",
                      "Green",
                      "Orange",
                      "Pink",
                      "Red",
                    ] as const
                  ).map((color) => {
                    const colorClasses: Record<string, string> = {
                      Purple: "bg-purple-600",
                      Blue: "bg-blue-600",
                      Green: "bg-green-600",
                      Orange: "bg-orange-600",
                      Pink: "bg-pink-600",
                      Red: "bg-red-600",
                    };
                    return (
                      <button
                        key={color}
                        onClick={() => updateAppearance({ colorScheme: color })}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          appearance.colorScheme === color
                            ? "border-purple-600 bg-gray-700/50"
                            : "border-gray-600 bg-gray-700/30 hover:border-gray-500"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-12 h-12 rounded-full ${colorClasses[color]}`}
                          ></div>
                          <span className="text-white font-medium text-sm">
                            {color}
                          </span>
                          {appearance.colorScheme === color && (
                            <CheckIcon
                              className="text-purple-400"
                              fontSize="small"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Other Tabs Placeholder */}
          {activeSettingsTab !== "Profile" &&
            activeSettingsTab !== "Account" &&
            activeSettingsTab !== "Appearance" && (
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-bold text-white mb-2">
                  {activeSettingsTab}
                </h2>
                <p className="text-gray-400">This section is coming soon.</p>
              </div>
            )}

          {/* Footer */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            Need help with your account settings?{" "}
            <a
              href="#"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
