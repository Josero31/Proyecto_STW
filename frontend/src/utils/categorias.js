// los 12 grupos del mundial 2026, cada uno con su emoji y color
// el color sale aproximadamente del equipo "cabeza de grupo"
// TODO fase 3: agregar categorias FWC (estampas oficiales) y CC (coca cola),
// que tambien van en el album pero no son de grupo
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
];

export const ESTADOS = ['faltante', 'repetida', 'pegada'];

export function obtenerCategoria(id) {
  return CATEGORIAS.find((c) => c.id === id);
}
