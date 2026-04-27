import { Link, Outlet } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

function AdminLayout() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <>
      <header>
        <span>SkillMatch</span>
        <span>{user?.name} · Admin</span>
        <button type="button" onClick={logout}>Cerrar sesión</button>
      </header>
      <div>
        <nav>
          <Link to="/admin/skills">Gestión de skills</Link>
          <Link to="/admin/ngos">Verificación de ONGs</Link>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default AdminLayout;
