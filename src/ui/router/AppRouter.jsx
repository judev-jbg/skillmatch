/**
 * Router principal de la aplicación.
 * Define rutas públicas, privadas y protección por rol.
 * Las páginas se cargan con lazy loading para optimizar el bundle inicial.
 */

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

// Páginas con lazy loading
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const StudentLayout = lazy(() => import('../layouts/StudentLayout'));
const NgoLayout = lazy(() => import('../layouts/NgoLayout'));
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const StudentProfilePage = lazy(() => import('../pages/student/StudentProfilePage'));

/** Dashboard de inicio por rol */
export const ROLE_HOME = {
  student: '/student',
  ngo: '/ngo',
  admin: '/admin',
};

/**
 * Protege rutas que requieren sesión activa.
 * Redirige a /login si no hay usuario autenticado.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Protege rutas según el rol del usuario.
 * Si el rol no coincide, redirige al dashboard del rol correspondiente.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.role - Rol requerido para acceder
 */
export function RoleRoute({ children, role }) {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== role) {
    return <Navigate to={ROLE_HOME[user?.role] ?? '/login'} replace />;
  }
  return children;
}

/**
 * Árbol de rutas de la aplicación sin provider de router.
 * Acepta componentes de página como props para facilitar el testing.
 *
 * @param {object} [pages] - Overrides de componentes de página (para tests)
 */
export function AppRoutes({
  Login = LoginPage,
  Register = RegisterPage,
  Student = StudentLayout,
  Ngo = NgoLayout,
  Admin = AdminLayout,
  StudentProfile = StudentProfilePage,
} = {}) {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas privadas — estudiante */}
      <Route
        path="/student"
        element={
          <ProtectedRoute>
            <RoleRoute role="student">
              <Student />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Rutas privadas — ONG */}
      <Route
        path="/ngo/*"
        element={
          <ProtectedRoute>
            <RoleRoute role="ngo">
              <Ngo />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Rutas privadas — admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <RoleRoute role="admin">
              <Admin />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      {/* Raíz → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* 404 → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

/**
 * Router principal montado con BrowserRouter y Suspense para lazy loading.
 */
function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
