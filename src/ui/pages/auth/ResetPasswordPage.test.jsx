import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';

vi.mock('../../../infrastructure/api/authApi.js', () => ({
  resetPasswordRequest: vi.fn(),
}));

import { resetPasswordRequest } from '../../../infrastructure/api/authApi.js';

function renderPage(token = 'valid-token') {
  return render(
    <MemoryRouter initialEntries={[`/reset-password?token=${token}`]}>
      <Routes>
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/login" element={<div>LoginPage</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  resetPasswordRequest.mockResolvedValue({ message: 'ok' });
});

describe('ResetPasswordPage', () => {
  it('AC1: muestra campos de nueva contraseña y confirmación', () => {
    renderPage();
    expect(screen.getByLabelText(/nueva contraseña/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /restablecer/i })).toBeInTheDocument();
  });

  it('AC2: llama a resetPasswordRequest con token y nueva contraseña', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/nueva contraseña/i), {
      target: { value: 'NuevaPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'NuevaPass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));
    await waitFor(() =>
      expect(resetPasswordRequest).toHaveBeenCalledWith('valid-token', 'NuevaPass123')
    );
  });

  it('AC3: muestra error si las contraseñas no coinciden', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/nueva contraseña/i), {
      target: { value: 'Pass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'OtraPass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/no coinciden/i);
    expect(resetPasswordRequest).not.toHaveBeenCalled();
  });

  it('AC4: tras éxito redirige al login', async () => {
    renderPage();
    fireEvent.change(screen.getByLabelText(/nueva contraseña/i), {
      target: { value: 'NuevaPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'NuevaPass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));
    await screen.findByText('LoginPage');
  });

  it('AC5: token inválido/expirado muestra error con opción de solicitar uno nuevo', async () => {
    resetPasswordRequest.mockRejectedValueOnce(
      Object.assign(new Error('Token inválido'), { response: { status: 400 } })
    );
    renderPage();
    fireEvent.change(screen.getByLabelText(/nueva contraseña/i), {
      target: { value: 'NuevaPass123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), {
      target: { value: 'NuevaPass123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /restablecer/i }));
    await screen.findByRole('alert');
    expect(screen.getByRole('link', { name: /solicitar nuevo enlace/i })).toBeInTheDocument();
  });
});
