# Quiz Application - Folder Structure

## Recommended Folder Structure

```
lasuQuiz/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Basic UI components (buttons, inputs, cards)
│   │   ├── layout/          # Layout components (header, footer, sidebar)
│   │   └── quiz/            # Quiz-specific components (question card, timer, etc.)
│   │
│   ├── lib/                  # Utilities and helpers
│   │   ├── supabase/        # Supabase client and auth helpers
│   │   ├── utils/           # General utility functions
│   │   └── constants/       # App constants
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   └── useQuiz.ts       # Quiz-related hooks
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── auth.ts          # Auth-related types
│   │   ├── quiz.ts          # Quiz-related types
│   │   └── user.ts          # User types
│   │
│   ├── routes/               # Route components (file-based routing)
│   │   ├── _index.tsx       # Landing/home page
│   │   ├── login.tsx        # Login page (public)
│   │   ├── register.tsx     # Registration page (public)
│   │   │
│   │   ├── student/         # Student routes (protected)
│   │   │   ├── _layout.tsx  # Student layout wrapper
│   │   │   ├── dashboard.tsx
│   │   │   ├── quiz.$id.tsx # Dynamic quiz route
│   │   │   └── results.$id.tsx # Quiz results
│   │   │
│   │   └── admin/           # Admin routes (protected, admin-only)
│   │       ├── _layout.tsx  # Admin layout wrapper
│   │       ├── dashboard.tsx
│   │       ├── quizzes.tsx  # Manage quizzes
│   │       └── users.tsx    # Manage users
│   │
│   ├── routes.ts             # Route configuration file
│   ├── root.tsx              # Root layout component
│   └── app.css               # Global styles
│
├── public/                    # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Folder Responsibilities

### `/app/components/`
**Purpose**: Reusable UI components organized by domain

- **`ui/`**: Basic, generic components (Button, Input, Card, Modal, etc.)
  - These are framework-agnostic and can be used anywhere
  - Example: `Button.tsx`, `Input.tsx`, `Card.tsx`

- **`layout/`**: Layout-specific components
  - Header, Footer, Sidebar, Navigation
  - Example: `Header.tsx`, `StudentNav.tsx`, `AdminNav.tsx`

- **`quiz/`**: Quiz-specific components
  - QuestionCard, Timer, ProgressBar, AnswerOption
  - Example: `QuestionCard.tsx`, `QuizTimer.tsx`

### `/app/lib/`
**Purpose**: Utilities, configurations, and third-party integrations

- **`supabase/`**: Supabase client setup and auth utilities
  - `client.ts`: Supabase client initialization
  - `auth.ts`: Auth helper functions (login, logout, getSession)

- **`utils/`**: General utility functions
  - Date formatting, string manipulation, validation helpers
  - Example: `formatDate.ts`, `validateEmail.ts`

- **`constants/`**: App-wide constants
  - API endpoints, default values, configuration
  - Example: `routes.ts`, `config.ts`

### `/app/hooks/`
**Purpose**: Custom React hooks for shared logic

- **`useAuth.ts`**: Authentication state management
  - Returns: `{ user, loading, isAdmin, login, logout }`

- **`useQuiz.ts`**: Quiz-related hooks
  - Example: `useQuizTimer`, `useQuizProgress`

### `/app/types/`
**Purpose**: TypeScript type definitions

- **`auth.ts`**: User, Session, AuthResponse types
- **`quiz.ts`**: Quiz, Question, Answer, Result types
- **`user.ts`**: User profile, Student, Admin types

### `/app/routes/`
**Purpose**: Route components (React Router file-based routing)

- **Public routes**: `_index.tsx`, `login.tsx`, `register.tsx`
- **Student routes**: Under `student/` directory (protected)
- **Admin routes**: Under `admin/` directory (protected, admin-only)

### `/app/routes.ts`
**Purpose**: Central route configuration
- Defines all routes, route groups, and protection logic
- Uses React Router's route configuration API

## Route Organization Principles

1. **File-based routing**: React Router v7 uses file-based routing
2. **Nested routes**: Use `_layout.tsx` for shared layouts
3. **Dynamic routes**: Use `$param.tsx` syntax (e.g., `quiz.$id.tsx`)
4. **Route groups**: Organize by feature/role (student/, admin/)
5. **Protection**: Implemented via route loaders and components

