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

import { getAssignmentById } from '../../../infrastructure/api/assignmentApi.js';
import { getDeliverablesByAssignment } from '../../../infrastructure/api/deliverableApi.js';
import { downloadCertificate } from '../../../infrastructure/api/certificateApi.js';

const mockCompletedAssignment = {
  id: 'asgn1',
  project_title: 'Web banco de alimentos',
  student_name: 'Ana García',
  start_date: '2026-05-01',
  project_status: 'completed',
  certificate_id: 'cert1',
};

const mockInProgressAssignment = {
  id: 'asgn2',
  project_title: 'Campaña digital',
  student_name: 'Ana García',
  start_date: '2026-05-01',
  project_status: 'in_progress',
  certificate_id: null,
};

function renderPage(assignmentId = 'asgn1') {
  return render(
    <MemoryRouter initialEntries={[`/student/assignments/${assignmentId}`]}>
      <Routes>
        <Route path="/student/assignments/:id" element={<StudentAssignmentPage />} />
      </Routes>
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  getDeliverablesByAssignment.mockResolvedValue([]);
  downloadCertificate.mockResolvedValue(new Blob(['%PDF'], { type: 'application/pdf' }));
});

describe('StudentAssignmentPage — certificado (HU13)', () => {
  it('AC1: muestra botón Descargar certificado cuando project_status es completed', async () => {
    getAssignmentById.mockResolvedValue(mockCompletedAssignment);
    renderPage();
    expect(await screen.findByRole('button', { name: /descargar certificado/i })).toBeInTheDocument();
  });

  it('AC2: no muestra botón Descargar certificado cuando project_status no es completed', async () => {
    getAssignmentById.mockResolvedValue(mockInProgressAssignment);
    renderPage('asgn2');
    await screen.findByText('Campaña digital');
    expect(screen.queryByRole('button', { name: /descargar certificado/i })).not.toBeInTheDocument();
  });

  it('AC3: el botón llama a downloadCertificate con el certificate_id', async () => {
    getAssignmentById.mockResolvedValue(mockCompletedAssignment);
    renderPage();
    const btn = await screen.findByRole('button', { name: /descargar certificado/i });
    fireEvent.click(btn);
    await waitFor(() => expect(downloadCertificate).toHaveBeenCalledWith('cert1'));
  });

  it('AC4: muestra error si downloadCertificate falla', async () => {
    getAssignmentById.mockResolvedValue(mockCompletedAssignment);
    downloadCertificate.mockRejectedValueOnce(new Error('Error servidor'));
    renderPage();
    const btn = await screen.findByRole('button', { name: /descargar certificado/i });
    fireEvent.click(btn);
    await screen.findByRole('alert');
  });
});
