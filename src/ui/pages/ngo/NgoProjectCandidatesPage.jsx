import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsByProject, updateApplicationStatus } from '../../../infrastructure/api/applicationApi.js';

function NgoProjectCandidatesPage() {
  const { id } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getApplicationsByProject(id).then((data) => {
      setApplications(data);
      setLoading(false);
    });
  }, [id]);

  async function handleStatusChange(appId, status) {
    setErrorMsg('');
    try {
      const updated = await updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: updated.status } : a))
      );
    } catch (err) {
      if (err?.response?.status === 403) {
        setErrorMsg('No tienes permiso para realizar esta acción.');
      } else {
        setErrorMsg('Error al actualizar el estado. Intenta de nuevo.');
      }
    }
  }

  return (
    <div>
      <h1>Candidatos del proyecto</h1>

      {errorMsg && <p role="alert">{errorMsg}</p>}

      {loading && <p>Cargando...</p>}

      {!loading && applications.length === 0 && (
        <p>No hay candidatos para este proyecto.</p>
      )}

      {!loading && applications.map((app) => (
        <article key={app.id}>
          <p>{app.student.name}</p>
          <p>{app.student.email}</p>
          <p>{app.compatibility_score}</p>
          <p>{app.status}</p>
          <button onClick={() => handleStatusChange(app.id, 'approved')}>Aprobar</button>
          <button onClick={() => handleStatusChange(app.id, 'rejected')}>Rechazar</button>
        </article>
      ))}
    </div>
  );
}

export default NgoProjectCandidatesPage;
