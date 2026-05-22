// los 12 grupos del mundial 2026, cada uno con su emoji y color
// el color sale aproximadamente del equipo "cabeza de grupo"
// fase 3: agrego las dos categorias "especiales" del album que no son de
// grupo -> las oficiales FWC (logo, trofeo, estadios) y las de Coca-Cola.
// las marco con especial:true para poder contarlas aparte en las graficas.
export const CATEGORIAS = [
  { id: 'a', nombre: 'Grupo A', emoji: '🇲🇽', color: '#0b6e3b' },
  { id: 'b', nombre: 'Grupo B', emoji: '🇨🇦', color: '#c8102e' },
  { id: 'c', nombre: 'Grupo C', emoji: '🇺🇸', color: '#1c3a8a' },
  { id: 'd', nombre: 'Grupo D', emoji: '🇦🇷', color: '#6cace4' },
  { id: 'e', nombre: 'Grupo E', emoji: '🇧🇷', color: '#f4c542' },
  { id: 'f', nombre: 'Grupo F', emoji: '🇫🇷', color: '#0055a4' },
  { id: 'g', nombre: 'Grupo G', emoji: '🇪🇸', color: '#aa151b' },
  { id: 'h', nombre: 'Grupo H', emoji: '🇩🇪', color: '#1a1a1a' },
  { id: 'i', nombre: 'Grupo I', emoji: '🇵🇹', color: '#046a38' },
  { id: 'j', nombre: 'Grupo J', emoji: '🇮🇹', color: '#008c45' },
  { id: 'k', nombre: 'Grupo K', emoji: '🇧🇪', color: '#ed2939' },
  { id: 'l', nombre: 'Grupo L', emoji: '🇳🇱', color: '#ae1c28' },
  { id: 'fwc', nombre: 'Oficiales FWC', emoji: '🏆', color: '#7b3fb0', especial: true },
  { id: 'cc', nombre: 'Coca-Cola', emoji: '🥤', color: '#e23744', especial: true },
];

export const ESTADOS = ['faltante', 'repetida', 'pegada'];

// colores por estado, mismos hex que uso en el css para los bordes
export const COLOR_ESTADO = {
  faltante: '#d83a3a',
  repetida: '#e3a72e',
  pegada: '#2d8a3e',
};

export function obtenerCategoria(id) {
  return CATEGORIAS.find((c) => c.id === id);
}

export function esEspecial(categoriaId) {
  return Boolean(obtenerCategoria(categoriaId)?.especial);
}
