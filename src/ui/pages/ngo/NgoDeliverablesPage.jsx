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
      <div className="page-header">
        <h1 className="page-title">Entregables del proyecto</h1>
      </div>

      {errorMsg && (
        <div className="alert alert--error" role="alert" style={{ marginBottom: 'var(--space-5)' }}>
          {errorMsg}
        </div>
      )}

      <div className="card card--elevated section" style={{ maxWidth: '560px' }}>
        <div className="card__header">
          <h2 className="card__title">Añadir hito</h2>
        </div>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="form-field">
            <label className="form-label">Título del hito</label>
            <input
              type="text"
              aria-label="Título del hito"
              className="form-input"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label className="form-label">Descripción</label>
            <input
              type="text"
              aria-label="Descripción del hito"
              className="form-input"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <div>
            <button type="submit" className="btn btn--primary">Añadir hito</button>
          </div>
        </form>
      </div>

      {loading && <p className="loading">Cargando...</p>}

      {!loading && (
        <div className="item-list">
          {deliverables.map((d) => (
            <div key={d.id} className="card">
              <div className="card__header">
                <h3 className="card__title">{d.title}</h3>
                <span className={`badge${d.status === 'approved' ? ' badge--success' : d.status === 'rejected' ? ' badge--error' : d.status === 'in_review' ? ' badge--warning' : ''}`}>
                  {d.status}
                </span>
              </div>
              {d.description && (
                <div className="card__body"><p>{d.description}</p></div>
              )}
              {d.status === 'in_review' && (
                <div className="card__footer">
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn--primary btn--sm" onClick={() => handleReview(d.id, 'approved')}>
                      Aprobar
                    </button>
                    <button className="btn btn--danger btn--sm" onClick={() => handleReview(d.id, 'rejected')}>
                      Rechazar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NgoDeliverablesPage;
