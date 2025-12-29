# LASU Quiz Application

A modern, full-stack quiz application for the Computer Science department built with React Router, TypeScript, Tailwind CSS, MUI, and Supabase.

## 🚀 Features

- **Authentication** - Secure login/registration with Supabase
- **Role-Based Access** - Separate dashboards for Students and Admins
- **Quiz System** - Take quizzes, view results, and track progress
- **Admin Panel** - Manage quizzes, users, and view statistics
- **Modern UI** - Built with Tailwind CSS and Material-UI
- **Type-Safe** - Full TypeScript support
- **Server-Side Rendering** - Fast initial page loads with React Router

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router v7
- **Styling**: Tailwind CSS, Material-UI (MUI)
- **Backend**: Supabase (Auth + Database)
- **Language**: TypeScript
- **Package Manager**: pnpm

## 📋 Prerequisites

- Node.js 20+ 
- pnpm (or npm/yarn)
- Supabase account and project

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
```

### 3. Set Up Supabase Database

Follow the database schema instructions in [`docs/SETUP_GUIDE.md`](./docs/SETUP_GUIDE.md) to create the required tables.

### 4. Start Development Server

```bash
pnpm dev
```

Your application will be available at `http://localhost:5173`.

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- **[Folder Structure](./docs/FOLDER_STRUCTURE.md)** - Complete folder organization guide
- **[Route Map](./docs/ROUTE_MAP.md)** - All routes and access levels
- **[Setup Guide](./docs/SETUP_GUIDE.md)** - Detailed setup instructions with Supabase schema
- **[Routing Examples](./docs/ROUTING_EXAMPLE.md)** - How routing and protection works
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - Quick reference guide
- **[Metadata Guide](./docs/METADATA_GUIDE.md)** - SEO and page metadata documentation

## 🏗️ Project Structure

```
lasuQuiz/
├── app/
│   ├── components/     # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utilities and helpers
│   │   ├── supabase/  # Supabase client and auth
│   │   └── utils/     # General utilities
│   ├── routes/        # Route components
│   │   ├── student/   # Student routes (protected)
│   │   └── admin/     # Admin routes (protected)
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Supabase client
├── docs/              # Documentation
└── public/            # Static assets
```

## 🛣️ Routes

### Public Routes
- `/` - Home page
- `/login` - User login
- `/register` - User registration

### Student Routes (Protected)
- `/student/dashboard` - Student dashboard
- `/student/quiz/:id` - Take quiz
- `/student/results/:id` - View quiz results

### Admin Routes (Protected, Admin Only)
- `/admin/dashboard` - Admin dashboard
- `/admin/quizzes` - Manage quizzes
- `/admin/users` - Manage users

## 🧪 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with HMR

# Building
pnpm build            # Create production build
pnpm start            # Start production server

# Type Checking
pnpm typecheck        # Run TypeScript type checking
```

## 🐳 Docker Deployment

```bash
# Build Docker image
docker build -t lasuquiz .

# Run container
docker run -p 3000:3000 lasuquiz
```

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Your Supabase publishable key |

## 🔒 Security

- All routes are protected with authentication
- Role-based access control (Student/Admin)
- Environment variables are excluded from git
- Supabase handles secure authentication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for educational purposes.

---

Built with ❤️ using React Router, TypeScript, and Supabase.
