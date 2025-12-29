# Quiz Application - Setup Guide

## Overview

This is a clean, scalable folder structure for a React Router v7 quiz application with Supabase authentication and role-based access control.

## Quick Start

### 1. Install Dependencies

```bash
# Install Supabase client
pnpm add @supabase/supabase-js

# All other dependencies are already in package.json
pnpm install
```

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

### 3. Supabase Database Setup

You'll need to create the following tables in Supabase:

#### `user_profiles` table
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `quizzes` table
```sql
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- in minutes
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `questions` table
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'short-answer')),
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `quiz_attempts` table
```sql
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES auth.users(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  total_points INTEGER
);
```

#### `user_answers` table
```sql
CREATE TABLE user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  answer TEXT NOT NULL,
  is_correct BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Run the Application

```bash
pnpm dev
```

## How Routing Works

### Route Protection

Routes are protected using **loaders** that run before the component renders:

1. **Public Routes**: No loader protection
   - `/`, `/login`, `/register`

2. **Protected Routes**: Use `requireAuth()` in loader
   - All `/student/*` and `/admin/*` routes

3. **Role-Based Routes**: Use `requireRole()` or specific functions
   - `/admin/*` uses `requireAdmin()`
   - `/student/*` uses `requireStudent()`

### Example: Protected Route

```typescript
// app/routes/student/dashboard.tsx
export async function loader() {
  await requireStudent(); // Redirects to /login if not authenticated
  // Fetch data...
  return { data };
}
```

### Route Organization

- **File-based routing**: React Router v7 uses file names to define routes
- **Layout routes**: `_layout.tsx` files wrap child routes
- **Dynamic routes**: Use `$param.tsx` syntax (e.g., `quiz.$id.tsx`)

## Key Files Explained

### `/app/routes.ts`
Central route configuration. Defines all routes, layouts, and loaders.

### `/app/lib/supabase/auth.ts`
Supabase authentication helpers:
- `getSession()` - Get current user session
- `signIn()` - Login user
- `signUp()` - Register new user
- `signOut()` - Logout user
- `getCurrentUser()` - Get current user with role

### `/app/lib/utils/route-guards.ts`
Route protection utilities:
- `requireAuth()` - Require any authenticated user
- `requireRole()` - Require specific role(s)
- `requireAdmin()` - Require admin role
- `requireStudent()` - Require student role

### `/app/hooks/useAuth.ts`
React hook for authentication state:
```typescript
const { user, loading, isAuthenticated, isAdmin, isStudent, logout } = useAuth();
```

## Customization

### Adding New Routes

1. Create the route file in `app/routes/`
2. Add the route to `app/routes.ts`
3. Add protection if needed (loader function)

### Adding Components

- **UI components**: `app/components/ui/`
- **Layout components**: `app/components/layout/`
- **Quiz components**: `app/components/quiz/`

### Styling

- Uses Tailwind CSS (already configured)
- Global styles in `app/app.css`
- Dark mode support included

## Next Steps

1. **Connect to Supabase**: Update the auth functions to match your schema
2. **Implement Quiz Logic**: Add quiz taking, scoring, and results
3. **Add Admin Features**: Quiz creation, user management
4. **Enhance UI**: Add more components, animations, loading states
5. **Add Error Handling**: Better error boundaries and user feedback

## Project Structure Summary

```
app/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utilities and helpers
│   ├── supabase/  # Supabase client and auth
│   └── utils/     # General utilities
├── routes/        # Route components
│   ├── student/   # Student routes (protected)
│   └── admin/     # Admin routes (protected)
├── types/         # TypeScript types
└── routes.ts      # Route configuration
```

## Notes

- All route components include example implementations
- Mock data is used in loaders - replace with Supabase queries
- Authentication flow is set up but needs Supabase configuration
- Role-based access control is implemented via route loaders
- All routes are typed with React Router's type generation

