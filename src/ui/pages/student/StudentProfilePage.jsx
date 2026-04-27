import { useEffect, useState } from 'react';
import { getStudentMe, updateStudentMe, updateStudentSkills } from '../../../infrastructure/api/studentApi.js';
import { getAllSkills } from '../../../infrastructure/api/skillsApi.js';

const LEVELS = ['básico', 'intermedio', 'avanzado'];

function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [disponibilidad, setDisponibilidad] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkillId, setNewSkillId] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(LEVELS[0]);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    Promise.all([getStudentMe(), getAllSkills()])
      .then(([p, s]) => {
        setProfile(p);
        setDisponibilidad(p.disponibilidad);
        setPortfolioUrl(p.portfolio_url ?? '');
        setSkills(p.skills ?? []);
        setAllSkills(s);
      })
      .catch(() => setLoadError('Error al cargar el perfil. Intenta de nuevo.'));
  }, []);

  async function handleSaveProfile() {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const updated = await updateStudentMe({ disponibilidad, portfolio_url: portfolioUrl });
      setProfile((prev) => ({ ...prev, ...updated }));
      setSuccessMsg('Perfil actualizado correctamente.');
    } catch {
      setErrorMsg('Error al actualizar el perfil. Intenta de nuevo.');
    }
  }

  async function handleAddSkill() {
    if (!newSkillId) return;
    const next = [
      ...skills.map((s) => ({ skill_id: s.id, level: s.level })),
      { skill_id: newSkillId, level: newSkillLevel },
    ];
    await updateStudentSkills(next);
    const added = allSkills.find((s) => s.id === newSkillId);
    setSkills((prev) => [...prev, { id: newSkillId, name: added?.name ?? newSkillId, level: newSkillLevel }]);
    setNewSkillId('');
    setNewSkillLevel(LEVELS[0]);
  }

  async function handleRemoveSkill(skillId) {
    const next = skills
      .filter((s) => s.id !== skillId)
      .map((s) => ({ skill_id: s.id, level: s.level }));
    await updateStudentSkills(next);
    setSkills((prev) => prev.filter((s) => s.id !== skillId));
  }

  async function handleChangeLevel(skillId, level) {
    const next = skills.map((s) => ({
      skill_id: s.id,
      level: s.id === skillId ? level : s.level,
    }));
    await updateStudentSkills(next);
    setSkills((prev) => prev.map((s) => (s.id === skillId ? { ...s, level } : s)));
  }

  const availableSkills = allSkills.filter((s) => !skills.some((us) => us.id === s.id));

  if (loadError) return <p>{loadError}</p>;
  if (!profile) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Mi perfil</h1>

      <section>
        <p>{profile.name}</p>
        <p>{profile.email}</p>

        <label>
          <input
            type="checkbox"
            aria-label="Disponibilidad"
            checked={disponibilidad}
            onChange={(e) => setDisponibilidad(e.target.checked)}
          />
          Disponibilidad
        </label>

        <label>
          Portfolio URL
          <input
            type="url"
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
          />
        </label>

        {successMsg && <p role="status">{successMsg}</p>}
        {errorMsg && <p role="alert">{errorMsg}</p>}

        <button type="button" onClick={handleSaveProfile}>
          Guardar perfil
        </button>
      </section>

      <section>
        <h2>Skills</h2>

        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>
              <span>{skill.name}</span>
              <select
                aria-label={`Nivel de ${skill.name}`}
                value={skill.level}
                onChange={(e) => handleChangeLevel(skill.id, e.target.value)}
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <button type="button" onClick={() => handleRemoveSkill(skill.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        <div>
          <label>
            Agregar skill
            <select
              aria-label="Agregar skill"
              value={newSkillId}
              onChange={(e) => setNewSkillId(e.target.value)}
            >
              <option value="">-- selecciona --</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>

          <label>
            Nivel
            <select
              aria-label="Nivel"
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </label>

          <button type="button" onClick={handleAddSkill}>
            Agregar
          </button>
        </div>
      </section>
    </div>
  );
}

export default StudentProfilePage;
