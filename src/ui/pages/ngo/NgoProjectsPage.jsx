import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOwnProjects } from '../../../infrastructure/api/projectApi.js';

function NgoProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOwnProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1>Mis proyectos</h1>
      <Link to="/ngo/projects/new">Nuevo proyecto</Link>

      {loading && <p>Cargando...</p>}

      {!loading && projects.length === 0 && (
        <p>No tienes proyectos creados todavía.</p>
      )}

      {!loading && projects.map((p) => (
        <article key={p.id}>
          <h2>{p.title}</h2>
          <span>{p.status}</span>
          <span>{p.modality}</span>
          <span>{p.deadline}</span>
          <Link to={`/ngo/projects/${p.id}/edit`}>Editar</Link>
        </article>
      ))}
    </div>
  );
}

export default NgoProjectsPage;
