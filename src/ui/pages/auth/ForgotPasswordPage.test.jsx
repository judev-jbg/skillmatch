import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';

vi.mock('../../../infrastructure/api/authApi.js', () => ({
  forgotPasswordRequest: vi.fn(),
}));

import { forgotPasswordRequest } from '../../../infrastructure/api/authApi.js';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/forgot-password']}>
      <Routes>
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  forgotPasswordRequest.mockResolvedValue({ message: 'ok' });
});

describe('ForgotPasswordPage', () => {
  it('AC1: muestra campo de email y botón de envío', () => {
    renderPage();
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('AC2: llama a forgotPasswordRequest con el email introducido', async () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'usuario@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    await waitFor(() =>
      expect(forgotPasswordRequest).toHaveBeenCalledWith('usuario@example.com')
    );
  });

  it('AC3: tras enviar muestra mensaje de confirmación sin revelar si el email existe', async () => {
    renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'cualquiera@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    await screen.findByText(/si el email está registrado/i);
  });

  it('AC4: error de API también muestra el mensaje de confirmación (no revela existencia)', async () => {
    forgotPasswordRequest.mockRejectedValueOnce(new Error('Not found'));
    renderPage();
    fireEvent.change(screen.getByRole('textbox', { name: /email/i }), {
      target: { value: 'noexiste@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));
    await screen.findByText(/si el email está registrado/i);
  });
});
