import { useState } from 'react';
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
      <main>
        <p>Si el email está registrado, recibirás un enlace para restablecer tu contraseña.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Recuperar contraseña</h1>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input
            type="email"
            aria-label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button type="submit">Enviar enlace</button>
      </form>
    </main>
  );
}

export default ForgotPasswordPage;
