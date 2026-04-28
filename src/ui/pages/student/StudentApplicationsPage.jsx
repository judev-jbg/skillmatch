import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOwnApplications } from '../../../infrastructure/api/applicationApi.js';

function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnApplications().then((data) => {
      setApplications(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Mis postulaciones</h1>

      {loading && <p>Cargando...</p>}

      {!loading && applications.length === 0 && (
        <p>No has aplicado a ningún proyecto todavía.</p>
      )}

      {!loading && applications.map((app) => (
        <article key={app.id}>
          <h2>{app.project_title}</h2>
          <span>{new Date(app.created_at).toLocaleDateString()}</span>
          <span>{app.compatibility_score}</span>
          <span>{app.status}</span>
          {app.status === 'approved' && (
            <Link to={`/student/assignments/${app.id}`}>Ver assignment</Link>
          )}
        </article>
      ))}
    </div>
  );
}

export default StudentApplicationsPage;
