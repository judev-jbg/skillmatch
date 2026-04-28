import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPasswordRequest } from '../../../infrastructure/api/authApi.js';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [tokenExpired, setTokenExpired] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setTokenExpired(false);

    if (password !== confirm) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    try {
      await resetPasswordRequest(token, password);
      navigate('/login', { replace: true });
    } catch (err) {
      if (err?.response?.status === 400) {
        setErrorMsg('El enlace es inválido o ha expirado.');
        setTokenExpired(true);
      } else {
        setErrorMsg('Error al restablecer la contraseña. Intenta de nuevo.');
      }
    }
  }

  return (
    <main>
      <h1>Restablecer contraseña</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="password">
          Nueva contraseña
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label htmlFor="confirm">
          Confirmar contraseña
          <input
            id="confirm"
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>
        {errorMsg && (
          <p role="alert">
            {errorMsg}
            {tokenExpired && (
              <> — <Link to="/forgot-password">Solicitar nuevo enlace</Link></>
            )}
          </p>
        )}
        <button type="submit">Restablecer contraseña</button>
      </form>
    </main>
  );
}

export default ResetPasswordPage;
