import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentById, acceptAssignment } from '../../../infrastructure/api/assignmentApi.js';
import { getDeliverablesByAssignment, startDeliverable, submitDeliverable } from '../../../infrastructure/api/deliverableApi.js';
import { downloadCertificate } from '../../../infrastructure/api/certificateApi.js';
import { createReview } from '../../../infrastructure/api/reviewApi.js';

function DeliverableItem({ deliverable, onStart, onSubmit }) {
  const [fileUrl, setFileUrl] = useState('');

  return (
    <article>
      <h3>{deliverable.title}</h3>
      <p>{deliverable.status}</p>
      {deliverable.description && <p>{deliverable.description}</p>}

      {deliverable.status === 'pending' && (
        <button onClick={() => onStart(deliverable.id)}>Iniciar</button>
      )}

      {deliverable.status === 'in_progress' && (
        <div>
          <label>
            URL del archivo
            <input
              type="text"
              aria-label="URL del archivo"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
            />
          </label>
          <button onClick={() => onSubmit(deliverable.id, fileUrl)}>Enviar a revisión</button>
        </div>
      )}
    </article>
  );
}

function StudentAssignmentPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [certError, setCertError] = useState('');
  const [reviewSent, setReviewSent] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    Promise.all([
      getAssignmentById(id),
      getDeliverablesByAssignment(id),
    ]).then(([asgn, dels]) => {
      setAssignment(asgn);
      setDeliverables(dels);
      setLoading(false);
    });
  }, [id]);

  async function handleAccept() {
    const updated = await acceptAssignment(id);
    setAssignment((prev) => ({ ...prev, project_status: updated.project_status }));
  }

  async function handleStart(deliverableId) {
    const updated = await startDeliverable(deliverableId);
    setDeliverables((prev) =>
      prev.map((d) => (d.id === deliverableId ? { ...d, status: updated.status } : d))
    );
  }

  async function handleDownloadCertificate() {
    setCertError('');
    try {
      const blob = await downloadCertificate(assignment.certificate_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificado.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setCertError('Error al descargar el certificado. Intenta de nuevo.');
    }
  }

  async function handleSendReview() {
    setReviewError('');
    try {
      await createReview({ assignment_id: id, rating: Number(reviewRating), comment: reviewComment });
      setReviewSent(true);
    } catch (err) {
      if (err?.response?.status === 409) {
        setReviewError('Ya has valorado este proyecto.');
      } else {
        setReviewError('Error al enviar la valoración. Intenta de nuevo.');
      }
    }
  }

  async function handleSubmit(deliverableId, fileUrl) {
    const updated = await submitDeliverable(deliverableId, fileUrl);
    setDeliverables((prev) =>
      prev.map((d) => (d.id === deliverableId ? { ...d, status: updated.status } : d))
    );
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{assignment?.project_title}</h1>
      <p>{assignment?.start_date}</p>

      {assignment?.project_status === 'assigned' && (
        <button onClick={handleAccept}>Aceptar</button>
      )}

      {assignment?.project_status === 'completed' && assignment?.certificate_id && (
        <button onClick={handleDownloadCertificate}>Descargar certificado</button>
      )}
      {certError && <p role="alert">{certError}</p>}

      {assignment?.project_status === 'completed' && !reviewSent && (
        <section>
          <h2>Dejar valoración</h2>
          <label>
            Valoración
            <input
              type="number"
              aria-label="Valoración"
              min={1}
              max={5}
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
            />
          </label>
          <label>
            Comentario
            <textarea
              aria-label="Comentario"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
          </label>
          {reviewError && <p role="alert">{reviewError}</p>}
          <button onClick={handleSendReview}>Enviar valoración</button>
        </section>
      )}

      <section>
        <h2>Entregables</h2>
        {deliverables.map((d) => (
          <DeliverableItem
            key={d.id}
            deliverable={d}
            onStart={handleStart}
            onSubmit={handleSubmit}
          />
        ))}
      </section>
    </div>
  );
}

export default StudentAssignmentPage;
