import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NgoDeliverablesPage from './NgoDeliverablesPage';

vi.mock('../../../infrastructure/api/deliverableApi.js', () => ({
  getDeliverablesByAssignment: vi.fn(),
  createDeliverable: vi.fn(),
  reviewDeliverable: vi.fn(),
}));

import {
  getDeliverablesByAssignment,
  createDeliverable,
  reviewDeliverable,
} from '../../../infrastructure/api/deliverableApi.js';

const mockDeliverables = [
  { id: 'd1', title: 'Diseño de BD', status: 'pending', description: 'Esquema inicial' },
  { id: 'd2', title: 'Backend API', status: 'in_review', description: 'Endpoints REST', file_url: 'https://example.com/api.pdf' },
  { id: 'd3', title: 'Frontend', status: 'approved', description: 'UI completa' },
];

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/ngo/projects/p1/assignments/asgn1/deliverables']}>
      <Routes>
        <Route
          path="/ngo/projects/:projectId/assignments/:assignmentId/deliverables"
          element={<NgoDeliverablesPage />}
        />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getDeliverablesByAssignment.mockResolvedValue(mockDeliverables);
  createDeliverable.mockResolvedValue({ id: 'd4', title: 'Nuevo hito', status: 'pending', description: '' });
  reviewDeliverable.mockResolvedValue({ id: 'd2', title: 'Backend API', status: 'approved' });
});

describe('NgoDeliverablesPage', () => {
  it('AC1: carga entregables desde getDeliverablesByAssignment al montar', async () => {
    renderPage();
    await waitFor(() => expect(getDeliverablesByAssignment).toHaveBeenCalledWith('asgn1'));
    expect(await screen.findByText('Diseño de BD')).toBeInTheDocument();
  });

  it('AC2: muestra título y estado de cada entregable', async () => {
    renderPage();
    await screen.findByText('Diseño de BD');
    expect(screen.getByText('Backend API')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
    expect(screen.getByText('in_review')).toBeInTheDocument();
    expect(screen.getByText('approved')).toBeInTheDocument();
  });

  it('AC3: el formulario de nuevo hito llama a createDeliverable con title y description', async () => {
    renderPage();
    await screen.findByText('Diseño de BD');
    fireEvent.change(screen.getByRole('textbox', { name: /título del hito/i }), {
      target: { value: 'Nuevo hito' },
    });
    fireEvent.click(screen.getByRole('button', { name: /añadir hito/i }));
    await waitFor(() =>
      expect(createDeliverable).toHaveBeenCalledWith(
        expect.objectContaining({ assignment_id: 'asgn1', title: 'Nuevo hito' })
      )
    );
  });

  it('AC4: el nuevo hito aparece en la lista tras crearlo', async () => {
    renderPage();
    await screen.findByText('Diseño de BD');
    fireEvent.change(screen.getByRole('textbox', { name: /título del hito/i }), {
      target: { value: 'Nuevo hito' },
    });
    fireEvent.click(screen.getByRole('button', { name: /añadir hito/i }));
    expect(await screen.findByText('Nuevo hito')).toBeInTheDocument();
  });

  it('AC5: los botones Aprobar y Rechazar solo aparecen en entregables in_review', async () => {
    renderPage();
    await screen.findByText('Backend API');
    expect(screen.getByRole('button', { name: /aprobar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rechazar/i })).toBeInTheDocument();
    // pending y approved no tienen botones de revisión
    expect(screen.getAllByRole('button', { name: /aprobar/i })).toHaveLength(1);
  });

  it('AC6: Aprobar llama a reviewDeliverable con approved y actualiza estado', async () => {
    renderPage();
    await screen.findByText('Backend API');
    fireEvent.click(screen.getByRole('button', { name: /aprobar/i }));
    await waitFor(() =>
      expect(reviewDeliverable).toHaveBeenCalledWith('d2', { status: 'approved' })
    );
    const approvedItems = await screen.findAllByText('approved');
    expect(approvedItems.length).toBeGreaterThanOrEqual(2);
  });

  it('AC7: Rechazar llama a reviewDeliverable con rejected y actualiza estado', async () => {
    reviewDeliverable.mockResolvedValue({ id: 'd2', title: 'Backend API', status: 'rejected' });
    renderPage();
    await screen.findByText('Backend API');
    fireEvent.click(screen.getByRole('button', { name: /rechazar/i }));
    await waitFor(() =>
      expect(reviewDeliverable).toHaveBeenCalledWith('d2', { status: 'rejected' })
    );
    expect(await screen.findByText('rejected')).toBeInTheDocument();
  });

  it('AC8: muestra error si reviewDeliverable falla', async () => {
    reviewDeliverable.mockRejectedValueOnce(new Error('Error servidor'));
    renderPage();
    await screen.findByText('Backend API');
    fireEvent.click(screen.getByRole('button', { name: /aprobar/i }));
    await screen.findByRole('alert');
  });
});
