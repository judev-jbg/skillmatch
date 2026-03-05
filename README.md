React + Vite (Javascript -> jsx)
CSS puro (para personalizacion maxima)
Para el estado Zustand, para proteccion y navegacion con React router DOM y Axios para la comunicion con la API
El backend gestionara los token jwt httponly cookie

Arquitectura hexagonal pragmatica

skillmatch/
│
├── .env # Variables de entorno (VITE_API_URL)
├── .env.example
├── index.html
├── vite.config.js
│
└── src/
│
├── App.jsx # Entry point — monta el router
│
├── domain/ # ⬡ Núcleo — lógica pura, sin React, sin fetch
│ ├── user/
│ │ └── User.js # Entidad + helpers de rol (isStudent, isNgo...)
│ ├── student/
│ │ └── Student.js # Entidad + SKILL_LEVELS
│ ├── ngo/
│ │ └── Ngo.js # Entidad + isVerified
│ ├── skill/
│ │ └── Skill.js
│ ├── project/
│ │ └── Project.js # Entidad + PROJECT_STATUS + canApply, canEdit
│ ├── application/
│ │ └── Application.js # Entidad + APPLICATION_STATUS
│ ├── assignment/
│ │ └── Assignment.js
│ ├── review/
│ │ └── Review.js
│ └── certificate/
│ └── Certificate.js
│
├── infrastructure/ # Todo lo que toca el exterior
│ ├── api/
│ │ ├── client.js # Axios config
│ │ ├── authApi.js
│ │ ├── userApi.js
│ │ ├── studentApi.js
│ │ ├── ngoApi.js
│ │ ├── projectApi.js
│ │ ├── applicationApi.js
│ │ ├── assignmentApi.js
│ │ ├── deliverableApi.js
│ │ ├── reviewApi.js
│ │ ├── certificateApi.js
│ │ └── adminApi.js
│ └── storage/
│ └── session.js
│
├── application/ # Casos de uso — orquestan dominio + infra
│ ├── auth/
│ │ ├── loginUseCase.js
│ │ └── registerUseCase.js
│ ├── student/
│ ├── ngo/
│ ├── project/
│ │ ├── getProjectsUseCase.js
│ │ └── createProjectUseCase.js
│ ├── application/
│ │ └── applyToProjectUseCase.js
│ ├── assignment/
│ │ └── createAssignmentUseCase.js
│ └── admin/
│
└── ui/ # React puro — solo presentación
├── router/
│ └── AppRouter.jsx # Rutas + PrivateRoute con control de rol
│
├── hooks/ # Puente entre casos de uso y componentes
│ ├── useAuthStore.js # Zustand store — user, login(), logout()
│ └── useProjects.js
│
├── layouts/ # Esqueletos por rol
│ ├── PublicLayout.jsx
│ ├── StudentLayout.jsx
│ ├── NgoLayout.jsx
│ └── AdminLayout.jsx
│
├── pages/
│ ├── auth/
│ │ ├── LoginPage.jsx
│ │ └── RegisterPage.jsx
│ ├── student/ # Dashboard, perfil, proyectos disponibles
│ ├── ngo/ # Dashboard, mis proyectos, candidatos
│ ├── admin/ # Verificar ONGs, gestionar skills
│ └── shared/ # Páginas comunes (404, etc.)
│
└── components/
├── common/ # Button, Input, Modal, Badge, Spinner...
├── project/ # ProjectCard, ProjectDetail, ProjectForm...
├── application/ # ApplicationCard, CandidateList...
├── assignment/ # AssignmentDetail, DeliverableForm...
└── review/ # ReviewCard, StarRating...
