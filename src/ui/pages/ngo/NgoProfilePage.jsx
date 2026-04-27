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

  if (loadError) return <p>{loadError}</p>;
  if (!profile) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Mi perfil</h1>

      {!profile.verified && (
        <p role="status">Tu organización está pendiente de verificación por el administrador.</p>
      )}

      {profile.verified && (
        <p>ONG verificada</p>
      )}

      <label>
        Nombre de contacto
        <input
          type="text"
          aria-label="Nombre de contacto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label>
        Nombre de organización
        <input
          type="text"
          aria-label="Nombre de organización"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
        />
      </label>

      <label>
        Área
        <input
          type="text"
          aria-label="Área"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />
      </label>

      {successMsg && <p role="status">{successMsg}</p>}
      {errorMsg && <p role="alert">{errorMsg}</p>}

      <button type="button" onClick={handleSave}>
        Guardar perfil
      </button>
    </div>
  );
}

export default NgoProfilePage;
