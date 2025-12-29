# Routing Organization Example

This document shows how routing is logically organized in the quiz application.

## Route Configuration (`app/routes.ts`)

```typescript
import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Public routes - no authentication required
  index("routes/_index.tsx"),                    // Home page
  route("login", "routes/login.tsx"),            // Login page
  route("register", "routes/register.tsx"),      // Registration page

  // Student routes - protected, student role required
  layout("routes/student/_layout.tsx", [          // Student layout wrapper
    route("student/dashboard", "routes/student/dashboard.tsx", {
      loader: "routes/student/dashboard.tsx",     // Protection in loader
    }),
    route("student/quiz/:id", "routes/student/quiz.$id.tsx", {
      loader: "routes/student/quiz.$id.tsx",
    }),
    route("student/results/:id", "routes/student/results.$id.tsx", {
      loader: "routes/student/results.$id.tsx",
    }),
  ]),

  // Admin routes - protected, admin role required
  layout("routes/admin/_layout.tsx", [           // Admin layout wrapper
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
```

## How Route Protection Works

### 1. Layout-Level Protection

Layout files (`_layout.tsx`) protect all child routes:

```typescript
// app/routes/student/_layout.tsx
export async function loader() {
  await requireStudent(); // Redirects to /login if not student
  return null;
}
```

### 2. Route-Level Protection

Individual routes can add additional checks:

```typescript
// app/routes/student/dashboard.tsx
export async function loader() {
  await requireStudent(); // Double protection (redundant but safe)
  
  // Fetch data after authentication check
  const quizzes = await fetchQuizzes();
  return { quizzes };
}
```

### 3. Action Protection

Form submissions are also protected:

```typescript
// app/routes/student/quiz.$id.tsx
export async function action({ request }: Route.ActionArgs) {
  await requireStudent(); // Protect form submission
  
  const formData = await request.formData();
  // Process quiz submission...
}
```

## Route Flow Examples

### Student Taking a Quiz

```
1. User visits /student/dashboard
   → Loader checks: requireStudent()
   → If not authenticated: redirect to /login
   → If authenticated: render dashboard

2. User clicks "Start Quiz" → /student/quiz/123
   → Loader checks: requireStudent()
   → Fetches quiz data
   → Renders quiz component

3. User submits quiz
   → Action checks: requireStudent()
   → Saves answers to database
   → Redirects to /student/results/123

4. User views results
   → Loader checks: requireStudent()
   → Fetches attempt data
   → Renders results
```

### Admin Managing Quizzes

```
1. Admin visits /admin/dashboard
   → Loader checks: requireAdmin()
   → If not admin: redirect to /student/dashboard
   → If admin: render admin dashboard

2. Admin navigates to /admin/quizzes
   → Loader checks: requireAdmin()
   → Fetches all quizzes
   → Renders quiz management interface
```

## Route Protection Utilities

All protection utilities are in `app/lib/utils/route-guards.ts`:

```typescript
// Require any authenticated user
await requireAuth();

// Require specific role(s)
await requireRole(["admin", "student"]);

// Require admin only
await requireAdmin();

// Require student only
await requireStudent();
```

These utilities:
- Check if user is authenticated
- Check if user has required role
- Redirect to appropriate page if checks fail
- Return user object if checks pass

## Benefits of This Structure

1. **Clear Separation**: Public, student, and admin routes are clearly separated
2. **Reusable Layouts**: Shared navigation and structure via layout files
3. **Type Safety**: Full TypeScript support with React Router type generation
4. **Protection at Multiple Levels**: Layout, route, and action protection
5. **Easy to Extend**: Add new routes by adding files and updating routes.ts
6. **Server-Side Protection**: Loaders run on server, protecting routes before render

## Adding a New Protected Route

1. Create the route file:
   ```typescript
   // app/routes/student/new-feature.tsx
   export async function loader() {
     await requireStudent();
     return { data: "..." };
   }
   
   export default function NewFeature() {
     return <div>...</div>;
   }
   ```

2. Add to routes.ts:
   ```typescript
   route("student/new-feature", "routes/student/new-feature.tsx", {
     loader: "routes/student/new-feature.tsx",
   }),
   ```

That's it! The route is now protected and accessible only to authenticated students.



