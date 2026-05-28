// Catalogo REAL del album Mundial 2026 (Panini).
// Cada equipo trae 20 estampas (PAIS1..PAIS20). Ademas estan las dos secciones
// especiales: las oficiales FWC (FWC1..FWC19) y las de Coca-Cola (CC1..CC14).
// El usuario NO escribe nombres: el album ya viene con todas las estampas y solo
// hace clic en cada boton para marcarla faltante -> pegada -> repetida.

// confederaciones (sirven de "categoria" para las graficas y el filtro)
export const CONFEDERACIONES = [
  { id: 'UEFA', nombre: 'UEFA', color: '#1c3a8a' },
  { id: 'CONMEBOL', nombre: 'CONMEBOL', color: '#f4c542' },
  { id: 'CONCACAF', nombre: 'CONCACAF', color: '#2d8a3e' },
  { id: 'CAF', nombre: 'CAF', color: '#c8102e' },
  { id: 'AFC', nombre: 'AFC', color: '#7b3fb0' },
  { id: 'OFC', nombre: 'OFC', color: '#0aa3a3' },
  { id: 'ESPECIAL', nombre: 'Especiales', color: '#c5a046' },
];

// los 48 equipos en el mismo orden de la planilla, con su prefijo de codigo,
// bandera, confederacion y un color representativo de la camiseta/bandera.
export const EQUIPOS = [
  { id: 'mex', cod: 'MEX', nombre: 'Mexico', emoji: '🇲🇽', conf: 'CONCACAF', color: '#006847' },
  { id: 'rsa', cod: 'RSA', nombre: 'Sudafrica', emoji: '🇿🇦', conf: 'CAF', color: '#007a4d' },
  { id: 'kor', cod: 'KOR', nombre: 'Corea del Sur', emoji: '🇰🇷', conf: 'AFC', color: '#c8102e' },
  { id: 'cze', cod: 'CZE', nombre: 'Chequia', emoji: '🇨🇿', conf: 'UEFA', color: '#11457e' },
  { id: 'can', cod: 'CAN', nombre: 'Canada', emoji: '🇨🇦', conf: 'CONCACAF', color: '#c8102e' },
  { id: 'bih', cod: 'BIH', nombre: 'Bosnia', emoji: '🇧🇦', conf: 'UEFA', color: '#002395' },
  { id: 'qat', cod: 'QAT', nombre: 'Qatar', emoji: '🇶🇦', conf: 'AFC', color: '#8a1538' },
  { id: 'sui', cod: 'SUI', nombre: 'Suiza', emoji: '🇨🇭', conf: 'UEFA', color: '#d52b1e' },
  { id: 'bra', cod: 'BRA', nombre: 'Brasil', emoji: '🇧🇷', conf: 'CONMEBOL', color: '#ffdf00' },
  { id: 'mar', cod: 'MAR', nombre: 'Marruecos', emoji: '🇲🇦', conf: 'CAF', color: '#c1272d' },
  { id: 'hai', cod: 'HAI', nombre: 'Haiti', emoji: '🇭🇹', conf: 'CONCACAF', color: '#00209f' },
  { id: 'sco', cod: 'SCO', nombre: 'Escocia', emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', conf: 'UEFA', color: '#0065bf' },
  { id: 'usa', cod: 'USA', nombre: 'Estados Unidos', emoji: '🇺🇸', conf: 'CONCACAF', color: '#1c3a8a' },
  { id: 'par', cod: 'PAR', nombre: 'Paraguay', emoji: '🇵🇾', conf: 'CONMEBOL', color: '#d52b1e' },
  { id: 'aus', cod: 'AUS', nombre: 'Australia', emoji: '🇦🇺', conf: 'AFC', color: '#00843d' },
  { id: 'tur', cod: 'TUR', nombre: 'Turquia', emoji: '🇹🇷', conf: 'UEFA', color: '#e30a17' },
  { id: 'ger', cod: 'GER', nombre: 'Alemania', emoji: '🇩🇪', conf: 'UEFA', color: '#1a1a1a' },
  { id: 'cuw', cod: 'CUW', nombre: 'Curazao', emoji: '🇨🇼', conf: 'CONCACAF', color: '#002b7f' },
  { id: 'civ', cod: 'CIV', nombre: 'Costa de Marfil', emoji: '🇨🇮', conf: 'CAF', color: '#f77f00' },
  { id: 'ecu', cod: 'ECU', nombre: 'Ecuador', emoji: '🇪🇨', conf: 'CONMEBOL', color: '#ffd100' },
  { id: 'ned', cod: 'NED', nombre: 'Paises Bajos', emoji: '🇳🇱', conf: 'UEFA', color: '#ff6c00' },
  { id: 'jpn', cod: 'JPN', nombre: 'Japon', emoji: '🇯🇵', conf: 'AFC', color: '#bc002d' },
  { id: 'swe', cod: 'SWE', nombre: 'Suecia', emoji: '🇸🇪', conf: 'UEFA', color: '#006aa7' },
  { id: 'tun', cod: 'TUN', nombre: 'Tunez', emoji: '🇹🇳', conf: 'CAF', color: '#e70013' },
  { id: 'bel', cod: 'BEL', nombre: 'Belgica', emoji: '🇧🇪', conf: 'UEFA', color: '#ed2939' },
  { id: 'egy', cod: 'EGY', nombre: 'Egipto', emoji: '🇪🇬', conf: 'CAF', color: '#ce1126' },
  { id: 'irn', cod: 'IRN', nombre: 'Iran', emoji: '🇮🇷', conf: 'AFC', color: '#239f40' },
  { id: 'nzl', cod: 'NZL', nombre: 'Nueva Zelanda', emoji: '🇳🇿', conf: 'OFC', color: '#00247d' },
  { id: 'esp', cod: 'ESP', nombre: 'Espana', emoji: '🇪🇸', conf: 'UEFA', color: '#aa151b' },
  { id: 'cpv', cod: 'CPV', nombre: 'Cabo Verde', emoji: '🇨🇻', conf: 'CAF', color: '#003893' },
  { id: 'ksa', cod: 'KSA', nombre: 'Arabia Saudita', emoji: '🇸🇦', conf: 'AFC', color: '#006c35' },
  { id: 'uru', cod: 'URU', nombre: 'Uruguay', emoji: '🇺🇾', conf: 'CONMEBOL', color: '#5cbfeb' },
  { id: 'fra', cod: 'FRA', nombre: 'Francia', emoji: '🇫🇷', conf: 'UEFA', color: '#0055a4' },
  { id: 'sen', cod: 'SEN', nombre: 'Senegal', emoji: '🇸🇳', conf: 'CAF', color: '#00853f' },
  { id: 'irq', cod: 'IRQ', nombre: 'Irak', emoji: '🇮🇶', conf: 'AFC', color: '#007a3d' },
  { id: 'nor', cod: 'NOR', nombre: 'Noruega', emoji: '🇳🇴', conf: 'UEFA', color: '#ba0c2f' },
  { id: 'arg', cod: 'ARG', nombre: 'Argentina', emoji: '🇦🇷', conf: 'CONMEBOL', color: '#6cace4' },
  { id: 'alg', cod: 'ALG', nombre: 'Argelia', emoji: '🇩🇿', conf: 'CAF', color: '#007229' },
  { id: 'aut', cod: 'AUT', nombre: 'Austria', emoji: '🇦🇹', conf: 'UEFA', color: '#ed2939' },
  { id: 'jor', cod: 'JOR', nombre: 'Jordania', emoji: '🇯🇴', conf: 'AFC', color: '#007a3d' },
  { id: 'por', cod: 'POR', nombre: 'Portugal', emoji: '🇵🇹', conf: 'UEFA', color: '#046a38' },
  { id: 'cod', cod: 'COD', nombre: 'RD Congo', emoji: '🇨🇩', conf: 'CAF', color: '#007fff' },
  { id: 'uzb', cod: 'UZB', nombre: 'Uzbekistan', emoji: '🇺🇿', conf: 'AFC', color: '#1eb53a' },
  { id: 'col', cod: 'COL', nombre: 'Colombia', emoji: '🇨🇴', conf: 'CONMEBOL', color: '#fcd116' },
  { id: 'eng', cod: 'ENG', nombre: 'Inglaterra', emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', conf: 'UEFA', color: '#1c3a8a' },
  { id: 'cro', cod: 'CRO', nombre: 'Croacia', emoji: '🇭🇷', conf: 'UEFA', color: '#ff0000' },
  { id: 'gha', cod: 'GHA', nombre: 'Ghana', emoji: '🇬🇭', conf: 'CAF', color: '#006b3f' },
  { id: 'pan', cod: 'PAN', nombre: 'Panama', emoji: '🇵🇦', conf: 'CONCACAF', color: '#d21034' },
];

// secciones especiales (no son equipos pero van en el album)
export const ESPECIALES = [
  { id: 'fwc', cod: 'FWC', nombre: 'Oficiales FWC', emoji: '🏆', conf: 'ESPECIAL', color: '#7b3fb0', total: 19, especial: true },
  { id: 'cc', cod: 'CC', nombre: 'Coca-Cola', emoji: '🥤', conf: 'ESPECIAL', color: '#e23744', total: 14, especial: true },
];

// todas las secciones del album en orden de planilla
export const SECCIONES = [...EQUIPOS.map((e) => ({ ...e, total: 20 })), ...ESPECIALES];

export const ESTADOS = ['faltante', 'pegada', 'repetida'];

// orden del ciclo al hacer clic: faltante -> pegada -> repetida -> faltante
export function siguienteEstado(estado) {
  const i = ESTADOS.indexOf(estado);
  return ESTADOS[(i + 1) % ESTADOS.length];
}

export const COLOR_ESTADO = {
  faltante: '#d83a3a',
  repetida: '#e3a72e',
  pegada: '#2d8a3e',
};

// genera las 993 estampas del album, todas en estado 'faltante' por defecto.
// estadosGuardados es un mapa { codigo: estado } que viene de localStorage.
export function generarCatalogo(estadosGuardados = {}) {
  const lista = [];
  for (const sec of SECCIONES) {
    for (let numero = 1; numero <= sec.total; numero++) {
      const codigo = `${sec.cod}${numero}`;
      lista.push({
        id: codigo,
        codigo,
        seccionId: sec.id,
        conf: sec.conf,
        especial: Boolean(sec.especial),
        numero,
        estado: estadosGuardados[codigo] || 'faltante',
        activo: true,
      });
    }
  }
  return lista;
}

export function obtenerSeccion(id) {
  return SECCIONES.find((s) => s.id === id);
}

export function obtenerConfederacion(id) {
  return CONFEDERACIONES.find((c) => c.id === id);
}
