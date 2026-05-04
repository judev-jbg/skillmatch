import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminDashboardPage from './AdminDashboardPage';

vi.mock('../../../infrastructure/api/skillsApi.js', () => ({
  getAllSkills: vi.fn(),
}));

vi.mock('../../../infrastructure/api/adminApi.js', () => ({
  createSkill: vi.fn(),
  updateSkill: vi.fn(),
  deleteSkill: vi.fn(),
  verifyNgo: vi.fn(),
  getUnverifiedNgos: vi.fn(),
}));

import { getAllSkills } from '../../../infrastructure/api/skillsApi.js';
import { createSkill, updateSkill, deleteSkill, verifyNgo, getUnverifiedNgos } from '../../../infrastructure/api/adminApi.js';

const mockSkills = [
  { id: 's1', name: 'React', category: 'Desarrollo' },
  { id: 's2', name: 'Figma', category: 'Diseno' },
];

const mockNgos = [
  { id: 'u1', name: 'ONG Verde', email: 'verde@ngo.com', organization_name: 'Fundación Verde', verified: false },
  { id: 'u2', name: 'ONG Azul', email: 'azul@ngo.com', organization_name: 'Fundación Azul', verified: true },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={<AdminDashboardPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getAllSkills.mockResolvedValue(mockSkills);
  getUnverifiedNgos.mockResolvedValue(mockNgos);
  createSkill.mockResolvedValue({ id: 's3', name: 'Node.js', category: 'Desarrollo' });
  updateSkill.mockResolvedValue({ id: 's1', name: 'React actualizado', category: 'Desarrollo' });
  deleteSkill.mockResolvedValue(null);
  verifyNgo.mockResolvedValue({ id: 'u1', verified: true });
});

describe('AdminDashboardPage — skills', () => {
  it('AC1: carga y muestra el listado de skills al montar', async () => {
    renderPage();
    expect(await screen.findByText('React')).toBeInTheDocument();
    expect(screen.getByText('Figma')).toBeInTheDocument();
  });

  it('AC2: crear skill llama a createSkill y la añade a la lista', async () => {
    renderPage();
    await screen.findByText('React');
    fireEvent.change(screen.getByRole('textbox', { name: /nombre de la skill/i }), {
      target: { value: 'Node.js' },
    });
    fireEvent.click(screen.getByRole('button', { name: /añadir/i }));
    await waitFor(() =>
      expect(createSkill).toHaveBeenCalledWith(expect.objectContaining({ name: 'Node.js' }))
    );
    expect(await screen.findByText('Node.js')).toBeInTheDocument();
  });

  it('AC3: eliminar skill muestra aviso de cascada y llama a deleteSkill', async () => {
    renderPage();
    await screen.findByText('React');
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);
    expect(await screen.findByText(/eliminación en cascada/i)).toBeInTheDocument();
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /eliminar/i }));
    await waitFor(() => expect(deleteSkill).toHaveBeenCalledWith('s1'));
  });

  it('AC4: tras eliminar, la skill desaparece de la lista', async () => {
    renderPage();
    await screen.findByText('React');
    const deleteButtons = screen.getAllByRole('button', { name: /eliminar/i });
    fireEvent.click(deleteButtons[0]);
    await screen.findByText(/eliminación en cascada/i);
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: /eliminar/i }));
    await waitFor(() => expect(deleteSkill).toHaveBeenCalled());
    expect(screen.queryByText('React')).not.toBeInTheDocument();
  });

  it('AC5: error de API al crear skill muestra alert', async () => {
    createSkill.mockRejectedValueOnce(new Error('Error servidor'));
    renderPage();
    await screen.findByText('React');
    fireEvent.change(screen.getByRole('textbox', { name: /nombre de la skill/i }), {
      target: { value: 'Error skill' },
    });
    fireEvent.click(screen.getByRole('button', { name: /añadir/i }));
    await screen.findByRole('alert');
  });
});

describe('AdminDashboardPage — ONGs', () => {
  it('AC6: muestra listado de ONGs con estado de verificación', async () => {
    renderPage();
    expect(await screen.findByText('Fundación Verde')).toBeInTheDocument();
    expect(screen.getByText('Fundación Azul')).toBeInTheDocument();
  });

  it('AC7: el botón Verificar solo aparece en ONGs no verificadas', async () => {
    renderPage();
    await screen.findByText('Fundación Verde');
    const verifyButtons = screen.getAllByRole('button', { name: /verificar/i });
    expect(verifyButtons).toHaveLength(1);
  });

  it('AC8: Verificar llama a verifyNgo y actualiza el estado en pantalla', async () => {
    renderPage();
    await screen.findByText('Fundación Verde');
    fireEvent.click(screen.getByRole('button', { name: /verificar/i }));
    await waitFor(() => expect(verifyNgo).toHaveBeenCalledWith('u1'));
    expect(screen.queryByRole('button', { name: /verificar/i })).not.toBeInTheDocument();
  });
});
