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
      <h1>{isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}</h1>

      <form onSubmit={handleSubmit} noValidate>
        <label>
          Título
          <input
            type="text"
            aria-label="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        {titleError && <p role="alert">{titleError}</p>}

        <label>
          Descripción
          <textarea
            aria-label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Objetivos
          <textarea
            aria-label="Objetivos"
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
          />
        </label>

        <label>
          Horas estimadas
          <input
            type="number"
            aria-label="Horas estimadas"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
          />
        </label>

        <label>
          Deadline
          <input
            type="date"
            aria-label="Deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </label>

        <label>
          Modalidad
          <select
            aria-label="Modalidad"
            value={modality}
            onChange={(e) => setModality(e.target.value)}
          >
            {MODALITIES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>

        {errorMsg && <p role="alert">{errorMsg}</p>}

        <button type="submit">Guardar</button>
      </form>
    </div>
  );
}

export default NgoProjectFormPage;
