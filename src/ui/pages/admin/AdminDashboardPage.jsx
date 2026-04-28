import { useEffect, useState } from 'react';
import { getAllSkills } from '../../../infrastructure/api/skillsApi.js';
import { createSkill, deleteSkill, verifyNgo, getUnverifiedNgos } from '../../../infrastructure/api/adminApi.js';

const CATEGORIES = ['Desarrollo', 'Diseno', 'CMS', 'Marketing'];

function AdminDashboardPage() {
  const [skills, setSkills] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState(CATEGORIES[0]);
  const [skillError, setSkillError] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    getAllSkills().then(setSkills);
    getUnverifiedNgos().then(setNgos);
  }, []);

  async function handleCreateSkill(e) {
    e.preventDefault();
    setSkillError('');
    if (!newSkillName.trim()) return;
    try {
      const created = await createSkill({ name: newSkillName.trim(), category: newSkillCategory });
      setSkills((prev) => [...prev, created]);
      setNewSkillName('');
    } catch {
      setSkillError('Error al crear la skill. Intenta de nuevo.');
    }
  }

  async function handleConfirmDelete() {
    await deleteSkill(pendingDeleteId);
    setSkills((prev) => prev.filter((s) => s.id !== pendingDeleteId));
    setPendingDeleteId(null);
  }

  async function handleVerifyNgo(userId) {
    await verifyNgo(userId);
    setNgos((prev) => prev.map((n) => (n.id === userId ? { ...n, verified: true } : n)));
  }

  return (
    <div>
      <h1>Panel de administración</h1>

      {/* Skills */}
      <section>
        <h2>Skills</h2>

        {skillError && <p role="alert">{skillError}</p>}

        <form onSubmit={handleCreateSkill}>
          <label>
            Nombre de la skill
            <input
              type="text"
              aria-label="Nombre de la skill"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
            />
          </label>
          <label>
            Categoría
            <select
              aria-label="Categoría"
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <button type="submit">Añadir skill</button>
        </form>

        {pendingDeleteId && (
          <div role="dialog">
            <p>Esta acción realizará una eliminación en cascada de todos los datos relacionados.</p>
            <button onClick={handleConfirmDelete}>Confirmar</button>
            <button onClick={() => setPendingDeleteId(null)}>Cancelar</button>
          </div>
        )}

        <ul>
          {skills.map((s) => (
            <li key={s.id}>
              <span>{s.name}</span>
              <span>{s.category}</span>
              <button onClick={() => setPendingDeleteId(s.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </section>

      {/* ONGs */}
      <section>
        <h2>ONGs</h2>
        {ngos.map((n) => (
          <article key={n.id}>
            <p>{n.organization_name}</p>
            <p>{n.email}</p>
            <p>{n.verified ? 'Verificada' : 'Pendiente'}</p>
            {!n.verified && (
              <button onClick={() => handleVerifyNgo(n.id)}>Verificar</button>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}

export default AdminDashboardPage;
