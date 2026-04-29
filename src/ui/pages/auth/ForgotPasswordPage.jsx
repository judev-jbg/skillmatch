import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordRequest } from '../../../infrastructure/api/authApi.js';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await forgotPasswordRequest(email.trim());
    } catch {
      // intencionalmente silencioso — no revelar si el email existe
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-confirmation">
            <p className="auth-confirmation__text">
              Si el email está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
          </div>
          <div className="auth-form__footer" style={{ marginTop: 'var(--space-6)', justifyContent: 'center' }}>
            <Link to="/login" className="auth-form__link">Volver al inicio de sesión</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-card__logo">Skill<span>Match</span></span>
        </div>

        <h1 className="auth-card__title">Recuperar contraseña</h1>
        <p className="auth-card__subtitle">
          Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              aria-label="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn--primary">Enviar enlace</button>
        </form>

        <div className="auth-form__footer" style={{ marginTop: 'var(--space-5)', justifyContent: 'center' }}>
          <Link to="/login" className="auth-form__link">Volver al inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
