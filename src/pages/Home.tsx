import { useNavigate } from "react-router-dom";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SecurityIcon from "@mui/icons-material/Security";
import TimelineIcon from "@mui/icons-material/Timeline";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { SEO } from "../components/SEO";
import { getWebsiteStructuredData } from "../utils/structuredData";

const Home = () => {
  const navigate = useNavigate();

  const highlights = [
    { title: "SSO ready", body: "Google, Discord, Twitter, and password login powered by Clerk.", icon: <SecurityIcon fontSize="small" /> },
    { title: "Analytics first", body: "Precision tracking for attempts, completions, and grade curves.", icon: <TimelineIcon fontSize="small" /> },
    { title: "Authoring built-in", body: "Design quizzes, schedule releases, and automate grading.", icon: <RocketLaunchIcon fontSize="small" /> },
    { title: "Student focus", body: "Accessible layouts, saved progress, and fast resume.", icon: <EmojiEventsIcon fontSize="small" /> },
  ];

  const stats = [
    { label: "Active learners", value: "12.4k" },
    { label: "Avg. completion", value: "92%" },
    { label: "Questions served", value: "1.8M" },
  ];

  return (
    <>
      <SEO
        title="Home"
        description="Quizzy — premium quiz delivery for teams and classrooms. Secure sign-in, analytics-first dashboards, and an elevated authoring experience."
        structuredData={getWebsiteStructuredData()}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-[#0b1220] to-gray-900 text-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-32 -top-24 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
              <MenuBookIcon className="text-white text-3xl" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Quiz platform</p>
              <h1 className="text-2xl font-bold">Quizzy</h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-200 hover:border-white/30 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/sign-in")}
              className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-200 hover:border-white/30 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/sign-up")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 text-sm font-semibold shadow-lg shadow-purple-500/20 hover:brightness-110 transition"
            >
              Get started
            </button>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 pb-16 relative z-10">
          <section className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center pt-6">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.28em] text-purple-300/80">Premium quiz delivery</p>
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Elevate every assessment with secure, elegant, and fast experiences.
              </h2>
              <p className="text-lg text-gray-300">
                Quizzy blends a polished authoring studio with powerful analytics and rock-solid authentication.
                Ship quizzes to classrooms or teams with confidence.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/admin")}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/25 hover:brightness-110 transition"
                >
                  Go to dashboard
                </button>
                <button
                  onClick={() => navigate("/quiz/1")}
                  className="px-6 py-3 rounded-xl border border-white/10 text-gray-200 hover:border-white/30 transition"
                >
                  Preview a quiz
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3"
                  >
                    <p className="text-gray-400 text-xs uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl shadow-purple-900/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-gray-900/70 p-4 flex items-start gap-3"
                  >
                    <div className="h-10 w-10 rounded-xl bg-purple-600/15 text-purple-300 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-900/60 to-purple-900/40 p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-2xl shadow-indigo-900/25">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-indigo-200/80 mb-2">Built-in auth</p>
              <h3 className="text-3xl font-bold">Instant SSO, no backend required</h3>
              <p className="text-gray-300 mt-2">
                Clerk handles Google, Discord, Twitter, and email/password so you can focus on content,
                not boilerplate.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate("/sign-up")}
                className="px-5 py-3 rounded-xl bg-white text-gray-900 font-semibold shadow-lg hover:shadow-xl transition"
              >
                Create account
              </button>
              <button
                onClick={() => navigate("/sign-in")}
                className="px-5 py-3 rounded-xl border border-white/30 text-white hover:border-white/50 transition"
              >
                Sign in
              </button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
