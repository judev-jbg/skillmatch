# SkillMatch — Frontend

Plataforma de conexión entre estudiantes y ONGs para prácticas y proyectos de voluntariado.

## Stack

- **React + Vite** (JavaScript / JSX)
- **React Router DOM v6** — navegación y protección de rutas por rol
- **Zustand** — gestión de estado de autenticación
- **Axios** — comunicación con la API (cookie HttpOnly para JWT)
- **CSS puro** — sin frameworks de UI
- **Vitest + Testing Library** — TDD estricto

## Arquitectura

Hexagonal pragmática: dominio puro en el centro, infraestructura en los bordes, UI como capa de presentación.

```
skillmatch/
│
├── .env
├── .env.example
├── index.html
├── vite.config.js
│
└── src/
    │
    ├── App.jsx                    # Entry point — monta el router
    │
    ├── domain/                    # Núcleo — lógica pura, sin React, sin fetch
    │   ├── user/
    │   │   └── User.js
    │   ├── student/
    │   │   └── Student.js
    │   ├── ngo/
    │   │   └── Ngo.js
    │   ├── skill/
    │   │   └── Skill.js
    │   ├── project/
    │   │   └── Project.js
    │   ├── application/
    │   │   └── Application.js
    │   ├── assignment/
    │   │   └── Assignment.js
    │   ├── review/
    │   │   └── Review.js
    │   └── certificate/
    │       └── Certificate.js
    │
    ├── infrastructure/
    │   ├── api/
    │   │   ├── client.js          # Axios — baseURL, withCredentials
    │   │   ├── authApi.js         # login, register, logout, forgot/reset password
    │   │   ├── userApi.js
    │   │   ├── usersApi.js
    │   │   ├── studentApi.js
    │   │   ├── ngoApi.js
    │   │   ├── projectApi.js
    │   │   ├── applicationApi.js
    │   │   ├── assignmentApi.js
    │   │   ├── deliverableApi.js
    │   │   ├── reviewApi.js
    │   │   ├── certificateApi.js
    │   │   ├── skillsApi.js
    │   │   └── adminApi.js
    │   └── storage/
    │       └── session.js
    │
    ├── application/               # Casos de uso
    │   ├── auth/
    │   │   ├── loginUseCase.js
    │   │   └── registerUseCase.js
    │   ├── student/
    │   ├── ngo/
    │   ├── project/
    │   │   ├── getProjectsUseCase.js
    │   │   └── createProjectUseCase.js
    │   ├── application/
    │   │   └── applyToProjectUseCase.js
    │   ├── assignment/
    │   │   └── createAssignmentUseCase.js
    │   └── admin/
    │
    └── ui/
        ├── router/
        │   └── AppRouter.jsx      # Rutas + ProtectedRoute + RoleRoute
        │
        ├── hooks/
        │   ├── useAuthStore.jsx   # Zustand — user, login(), logout()
        │   └── useProjects.jsx
        │
        ├── layouts/
        │   ├── PublicLayout.jsx
        │   ├── StudentLayout.jsx
        │   ├── NgoLayout.jsx
        │   └── AdminLayout.jsx
        │
        └── pages/
            ├── auth/
            │   ├── LoginPage.jsx
            │   ├── RegisterPage.jsx
            │   ├── ForgotPasswordPage.jsx
            │   └── ResetPasswordPage.jsx
            ├── student/
            │   ├── ProjectsListPage.jsx
            │   ├── ProjectDetailPage.jsx
            │   ├── StudentApplicationsPage.jsx
            │   ├── StudentAssignmentPage.jsx
            │   └── StudentProfilePage.jsx
            ├── ngo/
            │   ├── NgoProjectsPage.jsx
            │   ├── NgoProjectFormPage.jsx
            │   ├── NgoProjectCandidatesPage.jsx
            │   ├── NgoProjectAssignmentPage.jsx
            │   ├── NgoDeliverablesPage.jsx
            │   └── NgoProfilePage.jsx
            └── admin/
                └── AdminDashboardPage.jsx
```

## Rutas

| Ruta | Acceso | Página |
|------|--------|--------|
| `/login` | público | LoginPage |
| `/register` | público | RegisterPage |
| `/forgot-password` | público | ForgotPasswordPage |
| `/reset-password?token=…` | público | ResetPasswordPage |
| `/student/projects` | student | ProjectsListPage |
| `/student/projects/:id` | student | ProjectDetailPage |
| `/student/applications` | student | StudentApplicationsPage |
| `/student/assignments/:id` | student | StudentAssignmentPage |
| `/student/profile` | student | StudentProfilePage |
| `/ngo/projects` | ngo | NgoProjectsPage |
| `/ngo/projects/new` | ngo | NgoProjectFormPage |
| `/ngo/projects/:id/edit` | ngo | NgoProjectFormPage |
| `/ngo/projects/:id/candidates` | ngo | NgoProjectCandidatesPage |
| `/ngo/projects/:id/assignment` | ngo | NgoProjectAssignmentPage |
| `/ngo/projects/:projectId/assignments/:assignmentId/deliverables` | ngo | NgoDeliverablesPage |
| `/ngo/profile` | ngo | NgoProfilePage |
| `/admin` | admin | AdminDashboardPage |

## Desarrollo

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

Proyecto bajo TDD estricto — los tests se escriben antes de la implementación.
