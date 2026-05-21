import { createContext, useContext, useEffect, useState } from 'react';

const LLAVE_TEMA = 'album_mundial2026_tema';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    const guardado = localStorage.getItem(LLAVE_TEMA);
    return guardado === 'oscuro' || guardado === 'claro' ? guardado : 'claro';
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', tema);
    localStorage.setItem(LLAVE_TEMA, tema);
  }, [tema]);

  function cambiarTema() {
    setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'));
  }

  return (
    <ThemeContext.Provider value={{ tema, cambiarTema }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTema fuera de ThemeProvider');
  return ctx;
}
