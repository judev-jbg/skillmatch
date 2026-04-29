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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__logo">Skill<span>Match</span></span>
        </div>

        <h1 className="auth-card__title">Restablecer contraseña</h1>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label" htmlFor="password">Nueva contraseña</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="confirm">Confirmar contraseña</label>
            <input
              id="confirm"
              type="password"
              className="form-input"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {errorMsg && (
            <div className="alert alert--error" role="alert">
              {errorMsg}
              {tokenExpired && (
                <> — <Link to="/forgot-password" className="auth-form__link">Solicitar nuevo enlace</Link></>
              )}
            </div>
          )}

          <button type="submit" className="btn btn--primary">Restablecer contraseña</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
