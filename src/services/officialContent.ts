import { attractionService } from './attractionService';
import { deleteImagesByAttraction } from './imageStorage';
import {
  OFFICIAL_CONTENT_VERSION,
  OFFICIAL_UPDATED_AT,
} from '../data/attractions';

/**
 * Contenido oficial de la exposición.
 * ------------------------------------------------------------------
 * El contenido oficial viaja dentro de la compilación
 * (src/data/official-attractions.json). Este módulo garantiza que
 * cualquier dispositivo muestre el contenido oficial aunque su
 * almacenamiento local esté vacío u obsoleto, y permite restaurarlo
 * manualmente desde el panel administrativo.
 * ------------------------------------------------------------------
 */

const VERSION_KEY = 'huamanga_official_content_version';

export { OFFICIAL_CONTENT_VERSION, OFFICIAL_UPDATED_AT };

export function getStoredOfficialVersion(): string | null {
  try {
    return localStorage.getItem(VERSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Restaura el contenido oficial cuando la versión local es distinta.
 * Se ejecuta al iniciar la aplicación. NO elimina los favoritos del
 * visitante (viven en otra clave de almacenamiento).
 */
export function ensureOfficialContent(): void {
  try {
    const current = String(OFFICIAL_CONTENT_VERSION);
    if (getStoredOfficialVersion() !== current) {
      attractionService.resetToDefaults();
      localStorage.setItem(VERSION_KEY, current);
    }
  } catch {
    /* almacenamiento no disponible: se usa el contenido en memoria */
  }
}

/**
 * Restauración manual desde el panel administrativo:
 * elimina únicamente las modificaciones locales (incluidas las
 * imágenes subidas a IndexedDB) y vuelve al contenido oficial.
 * Conserva los favoritos del visitante.
 */
export async function restoreOfficialContent(): Promise<void> {
  const current = attractionService.getAll();
  for (const attraction of current) {
    await deleteImagesByAttraction(attraction.id);
  }
  attractionService.resetToDefaults();
  try {
    localStorage.setItem(VERSION_KEY, String(OFFICIAL_CONTENT_VERSION));
  } catch {
    /* ignorar */
  }
}
