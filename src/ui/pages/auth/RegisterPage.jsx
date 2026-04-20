/**
 * Página de registro de nuevos usuarios.
 * Soporta roles student y ngo, con campos adicionales para ONG.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUseCase } from '../../../application/auth/registerUseCase';

/**
 * Renderiza el formulario de registro y gestiona el flujo de creación de cuenta.
 */
function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [organizationName, setOrganizationName] = useState('');
  const [area, setArea] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /** @param {React.SyntheticEvent} e */
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!name || !email || !password) return;
    if (role === 'ngo' && !organizationName) return;

    const data = { name, email, password, role };
    if (role === 'ngo') {
      data.organization_name = organizationName;
      data.area = area;
    }

    setIsLoading(true);
    try {
      await registerUseCase(data);
      navigate('/login', { replace: true });
    } catch (err) {
      if (err?.response?.status === 409) {
        setEmailError('Email ya registrado');
      } else {
        setError('Error al registrarse. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>Crear cuenta</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Nombre</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          {emailError && <span>{emailError}</span>}
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="role">Rol</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="student">Estudiante</option>
            <option value="ngo">ONG</option>
          </select>
        </div>

        {role === 'ngo' && (
          <>
            <div>
              <label htmlFor="organizationName">Nombre de organización</label>
              <input
                id="organizationName"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="area">Área</label>
              <input
                id="area"
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
          </>
        )}

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={isLoading}>
          Registrarse
        </button>
      </form>
    </main>
  );
}

export default RegisterPage;
