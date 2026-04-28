import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import StudentAssignmentPage from './StudentAssignmentPage';

vi.mock('../../../infrastructure/api/assignmentApi.js', () => ({
  getAssignmentById: vi.fn(),
  acceptAssignment: vi.fn(),
}));

vi.mock('../../../infrastructure/api/deliverableApi.js', () => ({
  getDeliverablesByAssignment: vi.fn(),
  startDeliverable: vi.fn(),
  submitDeliverable: vi.fn(),
}));

vi.mock('../../../infrastructure/api/certificateApi.js', () => ({
  downloadCertificate: vi.fn(),
}));

vi.mock('../../../infrastructure/api/reviewApi.js', () => ({
  createReview: vi.fn(),
}));

import { getAssignmentById } from '../../../infrastructure/api/assignmentApi.js';
import { getDeliverablesByAssignment } from '../../../infrastructure/api/deliverableApi.js';
import { createReview } from '../../../infrastructure/api/reviewApi.js';

const mockCompletedAssignment = {
  id: 'asgn1',
  project_title: 'Web banco de alimentos',
  student_name: 'Ana García',
  start_date: '2026-05-01',
  project_status: 'completed',
  certificate_id: 'cert1',
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/student/assignments/asgn1']}>
      <Routes>
        <Route path="/student/assignments/:id" element={<StudentAssignmentPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getAssignmentById.mockResolvedValue(mockCompletedAssignment);
  getDeliverablesByAssignment.mockResolvedValue([]);
  createReview.mockResolvedValue({ id: 'r1', rating: 4, comment: 'Muy buen proyecto' });
});

describe('StudentAssignmentPage — valoración (HU14)', () => {
  it('AC1: muestra formulario de valoración cuando project_status es completed', async () => {
    renderPage();
    await screen.findByText('Web banco de alimentos');
    expect(screen.getByRole('spinbutton', { name: /valoración/i })).toBeInTheDocument();
  });

  it('AC2: no muestra formulario si project_status no es completed', async () => {
    getAssignmentById.mockResolvedValue({ ...mockCompletedAssignment, project_status: 'in_progress' });
    renderPage();
    await screen.findByText('Web banco de alimentos');
    expect(screen.queryByRole('spinbutton', { name: /valoración/i })).not.toBeInTheDocument();
  });

  it('AC3: enviar llama a createReview con assignment_id, rating y comment', async () => {
    renderPage();
    await screen.findByText('Web banco de alimentos');
    fireEvent.change(screen.getByRole('spinbutton', { name: /valoración/i }), {
      target: { value: '4' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /comentario/i }), {
      target: { value: 'Muy buen proyecto' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar valoración/i }));
    await waitFor(() =>
      expect(createReview).toHaveBeenCalledWith(
        expect.objectContaining({ assignment_id: 'asgn1', rating: 4, comment: 'Muy buen proyecto' })
      )
    );
  });

  it('AC4: tras enviar, el formulario se oculta', async () => {
    renderPage();
    await screen.findByText('Web banco de alimentos');
    fireEvent.change(screen.getByRole('spinbutton', { name: /valoración/i }), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar valoración/i }));
    await waitFor(() => expect(createReview).toHaveBeenCalled());
    expect(screen.queryByRole('spinbutton', { name: /valoración/i })).not.toBeInTheDocument();
  });

  it('AC5: error 409 muestra mensaje "ya has valorado"', async () => {
    createReview.mockRejectedValueOnce(
      Object.assign(new Error('Conflict'), { response: { status: 409 } })
    );
    renderPage();
    await screen.findByText('Web banco de alimentos');
    fireEvent.change(screen.getByRole('spinbutton', { name: /valoración/i }), {
      target: { value: '3' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar valoración/i }));
    await screen.findByRole('alert');
    expect(screen.getByRole('alert')).toHaveTextContent(/ya has valorado/i);
  });

  it('AC6: error genérico de API muestra mensaje visible', async () => {
    createReview.mockRejectedValueOnce(new Error('Error servidor'));
    renderPage();
    await screen.findByText('Web banco de alimentos');
    fireEvent.change(screen.getByRole('spinbutton', { name: /valoración/i }), {
      target: { value: '2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /enviar valoración/i }));
    await screen.findByRole('alert');
  });
});
