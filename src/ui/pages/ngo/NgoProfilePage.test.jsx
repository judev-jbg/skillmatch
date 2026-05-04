import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import NgoProfilePage from './NgoProfilePage';

vi.mock('../../../infrastructure/api/ngoApi.js', () => ({
  getNgoMe: vi.fn(),
  updateNgoMe: vi.fn(),
}));

vi.mock('../../../infrastructure/api/usersApi.js', () => ({
  updateUserMe: vi.fn(),
}));

import { getNgoMe, updateNgoMe } from '../../../infrastructure/api/ngoApi.js';
import { updateUserMe } from '../../../infrastructure/api/usersApi.js';

const mockProfile = {
  id: 'n1',
  user_id: 'u1',
  name: 'Juan Pérez',
  email: 'verde@ong.org',
  organization_name: 'Fundación Verde',
  area: 'Medio Ambiente',
  verified: true,
};

const mockUnverified = { ...mockProfile, verified: false };

beforeEach(() => {
  vi.clearAllMocks();
  getNgoMe.mockResolvedValue(mockProfile);
  updateNgoMe.mockResolvedValue(mockProfile);
  updateUserMe.mockResolvedValue({ name: mockProfile.name, email: mockProfile.email });
});

describe('NgoProfilePage', () => {
  it('AC1: carga datos desde getNgoMe al montar', async () => {
    render(<NgoProfilePage />);
    await waitFor(() => expect(getNgoMe).toHaveBeenCalledTimes(1));
    expect(await screen.findByDisplayValue('Fundación Verde')).toBeInTheDocument();
  });

  it('AC2: muestra nombre, email, organization_name, area e indicador de verificación', async () => {
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    expect(screen.getByDisplayValue('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('verde@ong.org')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Medio Ambiente')).toBeInTheDocument();
    expect(screen.getByText(/verificada/i)).toBeInTheDocument();
  });

  it('AC3: permite editar organization_name y area y llama updateNgoMe', async () => {
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    const orgInput = screen.getByDisplayValue('Fundación Verde');
    fireEvent.change(orgInput, { target: { value: 'Fundación Verde 2' } });

    const areaInput = screen.getByDisplayValue('Medio Ambiente');
    fireEvent.change(areaInput, { target: { value: 'Educación' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar perfil/i }));

    await waitFor(() =>
      expect(updateNgoMe).toHaveBeenCalledWith({
        organization_name: 'Fundación Verde 2',
        area: 'Educación',
      })
    );
  });

  it('AC4: permite editar name y email y llama updateUserMe', async () => {
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    const nameInput = screen.getByRole('textbox', { name: /nombre de contacto/i });
    fireEvent.change(nameInput, { target: { value: 'Nuevo Nombre' } });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    fireEvent.change(emailInput, { target: { value: 'nuevo@ong.org' } });

    fireEvent.click(screen.getByRole('button', { name: /guardar perfil/i }));

    await waitFor(() =>
      expect(updateUserMe).toHaveBeenCalledWith({
        name: 'Nuevo Nombre',
        email: 'nuevo@ong.org',
      })
    );
  });

  it('AC5: muestra mensaje de éxito tras guardar', async () => {
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    fireEvent.click(screen.getByRole('button', { name: /guardar perfil/i }));

    await screen.findByText(/perfil actualizado/i);
  });

  it('AC6a: muestra aviso informativo si la ONG no está verificada', async () => {
    getNgoMe.mockResolvedValue(mockUnverified);
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    expect(screen.getByRole('status')).toHaveTextContent(/pendiente de verificación/i);
  });

  it('AC6b: no muestra aviso si la ONG está verificada', async () => {
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    expect(screen.queryByText(/pendiente de verificación/i)).not.toBeInTheDocument();
  });

  it('AC7a: muestra error si updateNgoMe falla', async () => {
    updateNgoMe.mockRejectedValueOnce(new Error('Error servidor'));
    render(<NgoProfilePage />);
    await screen.findByDisplayValue('Fundación Verde');

    fireEvent.click(screen.getByRole('button', { name: /guardar perfil/i }));

    await screen.findByText(/error al actualizar/i);
  });

  it('AC7b: muestra error si getNgoMe falla al cargar', async () => {
    getNgoMe.mockRejectedValueOnce(new Error('No autorizado'));
    render(<NgoProfilePage />);

    await screen.findByText(/error al cargar/i);
  });
});
