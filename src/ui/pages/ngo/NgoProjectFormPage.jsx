import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createProject, updateProject, getProjectById } from '../../../infrastructure/api/projectApi.js';
import { getAllSkills } from '../../../infrastructure/api/skillsApi.js';

const MODALITIES = ['remoto', 'presencial', 'híbrido'];

function NgoProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [deadline, setDeadline] = useState('');
  const [modality, setModality] = useState(MODALITIES[0]);
  const [allSkills, setAllSkills] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    getAllSkills().then(setAllSkills);
    if (isEdit) {
      getProjectById(id).then((p) => {
        setTitle(p.title ?? '');
        setDescription(p.description ?? '');
        setObjectives(p.objectives ?? '');
        setEstimatedHours(p.estimated_hours ?? '');
        setDeadline(p.deadline ?? '');
        setModality(p.modality ?? MODALITIES[0]);
      });
    }
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setTitleError('');

    if (!title.trim()) {
      setTitleError('El título es obligatorio.');
      return;
    }

    const data = {
      title: title.trim(),
      description,
      objectives,
      estimated_hours: estimatedHours ? Number(estimatedHours) : undefined,
      deadline: deadline || undefined,
      modality,
    };

    try {
      if (isEdit) {
        await updateProject(id, data);
        navigate(`/ngo/projects/${id}`);
      } else {
        const created = await createProject(data);
        navigate(`/ngo/projects/${created.id}`);
      }
    } catch (err) {
      if (err?.response?.status === 403) {
        setErrorMsg('No tienes permiso para editar este proyecto.');
      } else {
        setErrorMsg('Error al guardar el proyecto. Intenta de nuevo.');
      }
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>
      </div>

      <div className="card card--elevated" style={{ maxWidth: '640px' }}>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label className="form-label">Título</label>
            <input
              type="text"
              aria-label="Título"
              className={`form-input${titleError ? ' form-input--error' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError && <span className="form-hint form-hint--error">{titleError}</span>}
          </div>

          <div className="form-field">
            <label className="form-label">Descripción</label>
            <textarea
              aria-label="Descripción"
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Objetivos</label>
            <textarea
              aria-label="Objetivos"
              className="form-textarea"
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div className="form-field" style={{ flex: 1 }}>
              <label className="form-label">Horas estimadas</label>
              <input
                type="number"
                aria-label="Horas estimadas"
                className="form-input"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>

            <div className="form-field" style={{ flex: 1 }}>
              <label className="form-label">Deadline</label>
              <input
                type="date"
                aria-label="Deadline"
                className="form-input"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Modalidad</label>
            <select
              aria-label="Modalidad"
              className="form-select"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
            >
              {MODALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <div className="alert alert--error" role="alert">{errorMsg}</div>
          )}

          <button type="submit" className="btn btn--primary">Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default NgoProjectFormPage;
