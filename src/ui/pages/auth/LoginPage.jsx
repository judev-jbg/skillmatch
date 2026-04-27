/**
 * Página de inicio de sesión.
 * Redirige al dashboard del rol correspondiente tras autenticarse.
 */

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuthStore from '../../hooks/useAuthStore';
import { ROLE_HOME } from '../../router/AppRouter';

/**
 * Renderiza el formulario de login y gestiona el flujo de autenticación.
 */
function LoginPage() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [offline, setOffline] = useState(false);

  if (user) return <Navigate to={ROLE_HOME[user.role] ?? '/login'} replace />;

  /** @param {React.SyntheticEvent} e */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) return;

    try {
      await login({ email, password });
      setOffline(false);
      const role = useAuthStore.getState().user?.role;
      navigate(ROLE_HOME[role] ?? '/login', { replace: true });
    } catch (err) {
      if (!err?.response) {
        setOffline(true);
      } else {
        setOffline(false);
        setError(
          err.response.status === 401
            ? 'Credenciales inválidas'
            : 'Error al iniciar sesión',
        );
      }
    }
  }

  return (
    <main>
      <h1>Iniciar sesión</h1>

      {offline && (
        <p role="status">
          Sin conexión con el servidor. Comprueba que el backend esté activo.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={isLoading}>
          {offline ? 'Reintentar' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
