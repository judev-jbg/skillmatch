import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProjects } from '../../../infrastructure/api/projectApi.js';
import { getAllSkills } from '../../../infrastructure/api/skillsApi.js';

const STATUSES = ['pending', 'assigned', 'in_progress', 'in_review', 'rejected', 'completed', 'cancelled'];

function ProjectsListPage() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [status, setStatus] = useState('pending');
  const [skillId, setSkillId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSkills().then(setSkills);
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters = { status };
    if (skillId) filters.skill_id = skillId;
    getAllProjects(filters).then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, [status, skillId]);

  return (
    <div>
      <h1>Proyectos disponibles</h1>

      <div>
        <label>
          Estado
          <select
            aria-label="Estado"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          Skill
          <select
            aria-label="Skill"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
          >
            <option value="">Todas</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p>Cargando...</p>}

      {!loading && projects.length === 0 && (
        <p>No hay proyectos que coincidan con los filtros.</p>
      )}

      {!loading && projects.map((project) => (
        <Link key={project.id} to={`/student/projects/${project.id}`}>
          <article>
            <h2>{project.title}</h2>
            <p>{project.description}</p>
            <span>{project.ngo?.name}</span>
            <span>{project.modality}</span>
            <span>{project.deadline}</span>
            <ul>
              {project.skills?.map((s) => (
                <li key={s.id}>{s.name}</li>
              ))}
            </ul>
          </article>
        </Link>
      ))}
    </div>
  );
}

export default ProjectsListPage;
