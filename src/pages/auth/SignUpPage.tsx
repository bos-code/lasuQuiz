import { SignUp } from "@clerk/clerk-react";
import DiversityIcon from "@mui/icons-material/Diversity3";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SecurityIcon from "@mui/icons-material/Security";

const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-8 lg:p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl shadow-indigo-900/20 space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white">
            <DiversityIcon />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-indigo-300/80 mb-2">Create account</p>
            <h1 className="text-4xl font-bold">Join the LASU Quiz platform</h1>
            <p className="text-gray-300 mt-3">
              Start with Google, Discord, Twitter, or set a password. Keep your academic journey
              synced and secure.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FeatureChip icon={<EmojiEventsIcon fontSize="small" />} label="Premium learning experience" />
            <FeatureChip icon={<SecurityIcon fontSize="small" />} label="Secure by Clerk infrastructure" />
            <FeatureChip icon={<EmojiEventsIcon fontSize="small" />} label="Adaptive exams and analytics" />
            <FeatureChip icon={<SecurityIcon fontSize="small" />} label="Two-step ready from day one" />
          </div>
        </div>

        <div className="p-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur shadow-2xl shadow-indigo-900/30">
          <div className="rounded-2xl bg-gray-900/80 border border-white/10 p-6">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/admin"
              afterSignInUrl="/admin"
              appearance={{
                variables: {
                  colorPrimary: "#6366f1",
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
                    "bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:brightness-110 shadow-lg shadow-indigo-600/25",
                  socialButtons:
                    "grid grid-cols-1 gap-2 [&_button]:!bg-gray-800 [&_button]:!border-gray-700 [&_button:hover]:!border-indigo-500/70",
                  formFieldInput:
                    "bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-indigo-500 focus:ring-indigo-500",
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
    <span className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-300 flex items-center justify-center">
      {icon}
    </span>
    <span>{label}</span>
  </div>
);

export default SignUpPage;
