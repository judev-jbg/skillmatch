import { Link, Outlet } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

function NgoLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <header>
        <span>SkillMatch</span>
        <span>{user?.name} · ONG</span>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </header>
      <div>
        <nav>
          <Link to="/ngo/projects">Mis proyectos</Link>
          <Link to="/ngo/candidates">Candidatos</Link>
          <Link to="/ngo/profile">Mi perfil</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default NgoLayout;
