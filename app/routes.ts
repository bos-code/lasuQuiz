import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/_index.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),

  // Student routes (protected)
  layout("routes/student/_layout.tsx", [
    route("student/dashboard", "routes/student/dashboard.tsx", {
      loader: "routes/student/dashboard.tsx",
    }),
    route("student/quiz/:id", "routes/student/quiz.$id.tsx", {
      loader: "routes/student/quiz.$id.tsx",
    }),
    route("student/results/:id", "routes/student/results.$id.tsx", {
      loader: "routes/student/results.$id.tsx",
    }),
  ]),

  // Admin routes (protected, admin-only)
  layout("routes/admin/_layout.tsx", [
    route("admin/dashboard", "routes/admin/dashboard.tsx", {
      loader: "routes/admin/dashboard.tsx",
    }),
    route("admin/quizzes", "routes/admin/quizzes.tsx", {
      loader: "routes/admin/quizzes.tsx",
    }),
    route("admin/users", "routes/admin/users.tsx", {
      loader: "routes/admin/users.tsx",
    }),
  ]),
] satisfies RouteConfig;
