const LLAVE = 'album_mundial2026_items';

export function leerItems() {
  try {
    const raw = localStorage.getItem(LLAVE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function guardarItems(items) {
  localStorage.setItem(LLAVE, JSON.stringify(items));
}
