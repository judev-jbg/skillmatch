import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectById } from '../../../infrastructure/api/projectApi.js';
import { createApplication } from '../../../infrastructure/api/applicationApi.js';

function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [applied, setApplied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getProjectById(id).then(setProject);
  }, [id]);

  async function handleApply() {
    setErrorMsg('');
    try {
      await createApplication(id);
      setApplied(true);
    } catch (err) {
      if (err?.response?.status === 409) {
        setApplied(true);
      } else {
        setErrorMsg('Error al aplicar al proyecto. Intenta de nuevo.');
      }
    }
  }

  if (!project) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{project.title}</h1>
      <p>{project.description}</p>
      <p>{project.objectives}</p>
      <span>{project.estimated_hours}</span>
      <span>{project.deadline}</span>
      <span>{project.modality}</span>
      <span>{project.status}</span>

      <ul>
        {project.skills?.map((s) => (
          <li key={s.id}>
            {s.name} — {s.required_level}
          </li>
        ))}
      </ul>

      {errorMsg && <p role="alert">{errorMsg}</p>}

      {project.status === 'pending' && (
        <button type="button" onClick={handleApply} disabled={applied}>
          {applied ? 'Ya has aplicado' : 'Aplicar'}
        </button>
      )}
    </div>
  );
}

export default ProjectDetailPage;
