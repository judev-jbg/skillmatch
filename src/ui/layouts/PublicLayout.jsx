import { Link, Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <>
      <header>
        <Link to="/">SkillMatch</Link>
        <nav>
          <Link to="/login">Iniciar sesión</Link>
          <Link to="/register">Registrarse</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default PublicLayout;
