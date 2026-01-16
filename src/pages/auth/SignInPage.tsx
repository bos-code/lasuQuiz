import { SignIn } from "@clerk/clerk-react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedIcon from "@mui/icons-material/Verified";

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 lg:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl shadow-purple-900/20 space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-600 text-white">
            <MenuBookIcon />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-purple-300/80 mb-2">Secure access</p>
            <h1 className="text-4xl font-bold">Sign in to LASU Quiz</h1>
            <p className="text-gray-300 mt-3">
              Continue with Google, Discord, Twitter, or your email and password. Sessions stay
              synced across devices.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FeatureChip icon={<ShieldIcon fontSize="small" />} label="SSO with Google/Discord/X" />
            <FeatureChip icon={<VerifiedIcon fontSize="small" />} label="Email + password supported" />
            <FeatureChip icon={<ShieldIcon fontSize="small" />} label="Session handoff between devices" />
            <FeatureChip icon={<VerifiedIcon fontSize="small" />} label="Protected admin routes" />
          </div>
        </div>

        <div className="p-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl shadow-purple-900/30">
          <div className="rounded-2xl bg-gray-900/80 border border-white/10 p-6">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/admin"
              afterSignUpUrl="/admin"
              appearance={{
                variables: {
                  colorPrimary: "#a855f7",
                  colorBackground: "transparent",
                  colorText: "#e5e7eb",
                  colorTextSecondary: "#9ca3af",
                  colorInputBackground: "rgba(255,255,255,0.04)",
                },
                elements: {
                  rootBox: "w-full",
                  card: "bg-gray-900/60 border border-white/10 shadow-xl rounded-2xl",
                  headerTitle: "text-xl font-semibold text-white",
                  headerSubtitle: "text-sm text-gray-300",
                  formButtonPrimary:
                    "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:brightness-110 shadow-lg shadow-purple-600/25",
                  socialButtons:
                    "grid grid-cols-1 gap-2 [&_button]:!bg-gray-800 [&_button]:!border-gray-700 [&_button:hover]:!border-purple-500/70",
                  formFieldInput:
                    "bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500",
                },
              }}
              socialLayout="button"
              // Enable Google, Discord, X(Twitter) via Clerk dashboard configuration
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureChip = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200">
    <span className="h-8 w-8 rounded-lg bg-purple-600/20 text-purple-300 flex items-center justify-center">
      {icon}
    </span>
    <span>{label}</span>
  </div>
);

export default SignInPage;
