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
      <div className="page-header">
        <h1 className="page-title">Panel de administración</h1>
      </div>

      {/* Diálogo de confirmación de eliminación */}
      {pendingDeleteId && (
        <div className="dialog-overlay">
          <div className="dialog" role="dialog">
            <h2 className="dialog__title">Eliminar skill</h2>
            <p className="dialog__body">
              Esta acción realizará una eliminación en cascada de todos los datos relacionados. Esta operación no se puede deshacer.
            </p>
            <div className="dialog__actions">
              <button className="btn btn--secondary" onClick={() => setPendingDeleteId(null)}>
                Cancelar
              </button>
              <button className="btn btn--danger" onClick={handleConfirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">Skills</h2>
        </div>

        {skillError && (
          <div className="alert alert--error" role="alert" style={{ marginBottom: 'var(--space-4)' }}>
            {skillError}
          </div>
        )}

        <div className="card card--elevated" style={{ maxWidth: '560px', marginBottom: 'var(--space-6)' }}>
          <form onSubmit={handleCreateSkill} style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="toolbar__group" style={{ flex: 2 }}>
              <label className="form-label">Nombre de la skill</label>
              <input
                type="text"
                aria-label="Nombre de la skill"
                className="form-input"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
              />
            </div>
            <div className="toolbar__group" style={{ flex: 1 }}>
              <label className="form-label">Categoría</label>
              <select
                aria-label="Categoría"
                className="form-select"
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="btn btn--primary">Añadir</button>
          </form>
        </div>

        <div className="item-list">
          {skills.map((s) => (
            <div key={s.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span className="skill-tag">{s.name}</span>
                <span className="badge">{s.category}</span>
              </div>
              <button className="btn btn--danger btn--sm" onClick={() => setPendingDeleteId(s.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ONGs */}
      <div className="section">
        <div className="section__header">
          <h2 className="section__title">ONGs pendientes de verificación</h2>
        </div>

        {ngos.length === 0 && (
          <div className="empty-state">
            <p className="empty-state__text">No hay ONGs pendientes de verificación.</p>
          </div>
        )}

        <div className="item-list">
          {ngos.map((n) => (
            <div key={n.id} className="card">
              <div className="card__header">
                <div>
                  <h3 className="card__title">{n.organization_name}</h3>
                  <p className="card__subtitle">{n.email}</p>
                </div>
                <span className={`badge${n.verified ? ' badge--success' : ' badge--warning'}`}>
                  {n.verified ? 'Verificada' : 'Pendiente'}
                </span>
              </div>
              {!n.verified && (
                <div className="card__footer">
                  <button className="btn btn--primary btn--sm" onClick={() => handleVerifyNgo(n.id)}>
                    Verificar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
