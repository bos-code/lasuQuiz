# Quiz Application - Route Map

## Public Routes (No Authentication Required)

| Route | Path | Component | Description |
|-------|------|-----------|-------------|
| Home | `/` | `routes/_index.tsx` | Landing page |
| Login | `/login` | `routes/login.tsx` | User login page |
| Register | `/register` | `routes/register.tsx` | User registration page |

## Protected Routes (Authentication Required)

### Student Routes (`/student/*`)

| Route | Path | Component | Access |
|-------|------|-----------|--------|
| Student Dashboard | `/student/dashboard` | `routes/student/dashboard.tsx` | Students only |
| Take Quiz | `/student/quiz/:id` | `routes/student/quiz.$id.tsx` | Students only |
| Quiz Results | `/student/results/:id` | `routes/student/results.$id.tsx` | Students only |

### Admin Routes (`/admin/*`)

| Route | Path | Component | Access |
|-------|------|-----------|--------|
| Admin Dashboard | `/admin/dashboard` | `routes/admin/dashboard.tsx` | Admins only |
| Manage Quizzes | `/admin/quizzes` | `routes/admin/quizzes.tsx` | Admins only |
| Manage Users | `/admin/users` | `routes/admin/users.tsx` | Admins only |

## Route Protection Strategy

### Protection Levels

1. **Public Routes**: Accessible to everyone
   - Home, Login, Register

2. **Authenticated Routes**: Require login (any role)
   - All `/student/*` and `/admin/*` routes

3. **Role-Based Routes**: Require specific role
   - `/admin/*` routes require Admin role
   - `/student/*` routes require Student role

### Implementation

- **Route Loaders**: Check authentication and role in route loaders
- **Redirects**: Unauthenticated users → `/login`
- **Role Guards**: Wrong role → `/student/dashboard` or `/admin/dashboard` (based on role)

## Route Flow Examples

### Student Flow
```
/ → /login → /student/dashboard → /student/quiz/123 → /student/results/123
```

### Admin Flow
```
/ → /login → /admin/dashboard → /admin/quizzes → /admin/users
```

### Unauthenticated Flow
```
/student/dashboard → /login (redirect)
/admin/dashboard → /login (redirect)
```



