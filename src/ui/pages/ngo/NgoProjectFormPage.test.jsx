import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NgoProjectFormPage from './NgoProjectFormPage';

vi.mock('../../../infrastructure/api/projectApi.js', () => ({
  createProject: vi.fn(),
  updateProject: vi.fn(),
  getProjectById: vi.fn(),
}));

vi.mock('../../../infrastructure/api/skillsApi.js', () => ({
  getAllSkills: vi.fn(),
}));

import { createProject, updateProject, getProjectById } from '../../../infrastructure/api/projectApi.js';
import { getAllSkills } from '../../../infrastructure/api/skillsApi.js';

const mockSkills = [
  { id: 's1', name: 'React' },
  { id: 's2', name: 'Node.js' },
];

const mockProject = {
  id: 'p1',
  title: 'Web banco de alimentos',
  description: 'Descripción del proyecto',
  objectives: 'Objetivos del proyecto',
  estimated_hours: 80,
  deadline: '2026-09-30',
  modality: 'remoto',
  skills: [{ id: 's1', name: 'React', required_level: 'intermediate' }],
};

function renderCreate() {
  return render(
    <MemoryRouter initialEntries={['/ngo/projects/new']}>
      <Routes>
        <Route path="/ngo/projects/new" element={<NgoProjectFormPage />} />
        <Route path="/ngo/projects/:id" element={<div>DetalleProyecto</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderEdit() {
  return render(
    <MemoryRouter initialEntries={['/ngo/projects/p1/edit']}>
      <Routes>
        <Route path="/ngo/projects/:id/edit" element={<NgoProjectFormPage />} />
        <Route path="/ngo/projects/:id" element={<div>DetalleProyecto</div>} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getAllSkills.mockResolvedValue(mockSkills);
  createProject.mockResolvedValue({ id: 'p-new', title: 'Web banco de alimentos' });
  updateProject.mockResolvedValue(mockProject);
  getProjectById.mockResolvedValue(mockProject);
});

describe('NgoProjectFormPage — crear', () => {
  it('AC1: muestra formulario con campos title, description, objectives, estimated_hours, deadline, modality', async () => {
    renderCreate();
    await screen.findByRole('textbox', { name: /título/i });
    expect(screen.getByRole('textbox', { name: /descripción/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /objetivos/i })).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /horas estimadas/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /modalidad/i })).toBeInTheDocument();
  });

  it('AC2: bloquea el submit si el título está vacío (validación cliente)', async () => {
    renderCreate();
    await screen.findByRole('textbox', { name: /título/i });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));
    expect(createProject).not.toHaveBeenCalled();
  });

  it('AC3: crea el proyecto y redirige al detalle', async () => {
    renderCreate();
    await screen.findByRole('textbox', { name: /título/i });

    fireEvent.change(screen.getByRole('textbox', { name: /título/i }), {
      target: { value: 'Nuevo proyecto' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => expect(createProject).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Nuevo proyecto' })
    ));
    await screen.findByText('DetalleProyecto');
  });

  it('AC4: muestra error si createProject falla', async () => {
    createProject.mockRejectedValueOnce(new Error('Error servidor'));
    renderCreate();
    await screen.findByRole('textbox', { name: /título/i });

    fireEvent.change(screen.getByRole('textbox', { name: /título/i }), {
      target: { value: 'Proyecto' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await screen.findByRole('alert');
  });
});

describe('NgoProjectFormPage — editar', () => {
  it('AC5: carga los datos del proyecto existente en el formulario', async () => {
    renderEdit();
    expect(await screen.findByDisplayValue('Web banco de alimentos')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Descripción del proyecto')).toBeInTheDocument();
  });

  it('AC6: actualiza el proyecto con updateProject y muestra los cambios', async () => {
    renderEdit();
    await screen.findByDisplayValue('Web banco de alimentos');

    fireEvent.change(screen.getByDisplayValue('Web banco de alimentos'), {
      target: { value: 'Título actualizado' },
    });
    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await waitFor(() => expect(updateProject).toHaveBeenCalledWith(
      'p1',
      expect.objectContaining({ title: 'Título actualizado' })
    ));
  });

  it('AC7: muestra error 403 si intenta editar un proyecto ajeno', async () => {
    updateProject.mockRejectedValueOnce(
      Object.assign(new Error('Forbidden'), { response: { status: 403 } })
    );
    renderEdit();
    await screen.findByDisplayValue('Web banco de alimentos');

    fireEvent.click(screen.getByRole('button', { name: /guardar/i }));

    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent(/no tienes permiso/i);
  });
});
