/**
 * Punto de entrada de la aplicación.
 * Hidrata la sesión desde la cookie JWT al montar y monta el router principal.
 */

import { useEffect } from 'react';
import AppRouter from './ui/router/AppRouter';
import useAuthStore from './ui/hooks/useAuthStore';

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <AppRouter />;
}

export default App;
