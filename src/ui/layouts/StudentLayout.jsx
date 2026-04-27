import { Link, Outlet } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

function StudentLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <header>
        <span>SkillMatch</span>
        <span>{user?.name} · Estudiante</span>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </header>
      <div>
        <nav>
          <Link to="/student/projects">Proyectos</Link>
          <Link to="/student/applications">Mis aplicaciones</Link>
          <Link to="/student/profile">Mi perfil</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default StudentLayout;
