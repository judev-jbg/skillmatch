import { useEffect, useState } from 'react';
import { getNgoMe, updateNgoMe } from '../../../infrastructure/api/ngoApi.js';
import { updateUserMe } from '../../../infrastructure/api/usersApi.js';

function NgoProfilePage() {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [area, setArea] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    getNgoMe()
      .then((p) => {
        setProfile(p);
        setName(p.name ?? '');
        setEmail(p.email ?? '');
        setOrganizationName(p.organization_name ?? '');
        setArea(p.area ?? '');
      })
      .catch(() => setLoadError('Error al cargar el perfil. Intenta de nuevo.'));
  }, []);

  async function handleSave() {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await Promise.all([
        updateNgoMe({ organization_name: organizationName, area }),
        updateUserMe({ name, email }),
      ]);
      setProfile((prev) => ({ ...prev, name, email, organization_name: organizationName, area }));
      setSuccessMsg('Perfil actualizado correctamente.');
    } catch {
      setErrorMsg('Error al actualizar el perfil. Intenta de nuevo.');
    }
  }

  if (loadError) return <div className="alert alert--error">{loadError}</div>;
  if (!profile) return <p className="loading">Cargando...</p>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mi perfil</h1>
        {profile.verified
          ? <span className="badge badge--success">ONG verificada</span>
          : <span className="badge badge--warning">Pendiente de verificación</span>
        }
      </div>

      {!profile.verified && (
        <div className="alert alert--warning" role="status" style={{ marginBottom: 'var(--space-6)' }}>
          Tu organización está pendiente de verificación por el administrador.
        </div>
      )}

      <div className="card card--elevated" style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <div className="form-field">
            <label className="form-label">Nombre de contacto</label>
            <input
              type="text"
              aria-label="Nombre de contacto"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email</label>
            <input
              type="email"
              aria-label="Email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Nombre de organización</label>
            <input
              type="text"
              aria-label="Nombre de organización"
              className="form-input"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>

          <div className="form-field">
            <label className="form-label">Área</label>
            <input
              type="text"
              aria-label="Área"
              className="form-input"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>

          {successMsg && <div className="alert alert--success" role="status">{successMsg}</div>}
          {errorMsg && <div className="alert alert--error" role="alert">{errorMsg}</div>}
        </div>
        <div className="card__footer" style={{ marginTop: 'var(--space-5)' }}>
          <button type="button" className="btn btn--primary" onClick={handleSave}>
            Guardar perfil
          </button>
        </div>
      </div>
    </div>
  );
}

export default NgoProfilePage;
