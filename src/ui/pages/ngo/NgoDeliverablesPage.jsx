import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDeliverablesByAssignment,
  createDeliverable,
  reviewDeliverable,
} from '../../../infrastructure/api/deliverableApi.js';

function NgoDeliverablesPage() {
  const { assignmentId } = useParams();
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getDeliverablesByAssignment(assignmentId).then((data) => {
      setDeliverables(data);
      setLoading(false);
    });
  }, [assignmentId]);

  async function handleCreate(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const created = await createDeliverable({
      assignment_id: assignmentId,
      title: newTitle.trim(),
      description: newDescription,
    });
    setDeliverables((prev) => [...prev, created]);
    setNewTitle('');
    setNewDescription('');
  }

  async function handleReview(id, status) {
    setErrorMsg('');
    try {
      const updated = await reviewDeliverable(id, { status });
      setDeliverables((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: updated.status } : d))
      );
    } catch {
      setErrorMsg('Error al revisar el entregable. Intenta de nuevo.');
    }
  }

  return (
    <div>
      <h1>Entregables del proyecto</h1>

      {errorMsg && <p role="alert">{errorMsg}</p>}

      <form onSubmit={handleCreate}>
        <label>
          Título del hito
          <input
            type="text"
            aria-label="Título del hito"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </label>
        <label>
          Descripción
          <input
            type="text"
            aria-label="Descripción del hito"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </label>
        <button type="submit">Añadir hito</button>
      </form>

      {loading && <p>Cargando...</p>}

      {!loading && deliverables.map((d) => (
        <article key={d.id}>
          <h3>{d.title}</h3>
          <p>{d.status}</p>
          {d.description && <p>{d.description}</p>}
          {d.status === 'in_review' && (
            <>
              <button onClick={() => handleReview(d.id, 'approved')}>Aprobar</button>
              <button onClick={() => handleReview(d.id, 'rejected')}>Rechazar</button>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

export default NgoDeliverablesPage;
