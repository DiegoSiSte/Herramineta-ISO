/**
 * storage.js
 * Persistencia en localStorage con manejo de errores.
 */

const CLAVE = 'riesgos_software_v1';

/**
 * Carga los riesgos desde localStorage.
 * @returns {Array} Lista de riesgos o array vacío si falla.
 */
export function cargarRiesgos() {
  try {
    const datos = localStorage.getItem(CLAVE);
    if (!datos) return [];
    return JSON.parse(datos);
  } catch (e) {
    console.warn('No se pudo cargar desde localStorage:', e);
    return [];
  }
}

/**
 * Guarda los riesgos en localStorage.
 * @param {Array} riesgos - Lista de riesgos a persistir.
 */
export function guardarRiesgos(riesgos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(riesgos));
  } catch (e) {
    console.warn('No se pudo guardar en localStorage:', e);
  }
}
