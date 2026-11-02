/**
 * riskCalc.js
 * Lógica de cálculo de riesgo: exposición y nivel.
 * NUNCA duplicar estas funciones en los componentes.
 */

/**
 * Calcula la exposición de un riesgo.
 * @param {number} probabilidad - Entero 1-5
 * @param {number} impacto - Entero 1-5
 * @returns {number} Exposición (1-25)
 */
export function calcularExposicion(probabilidad, impacto) {
  return probabilidad * impacto;
}

/**
 * Obtiene el nivel de riesgo según la exposición.
 * @param {number} exposicion - Valor calculado (1-25)
 * @returns {{ nivel: string, clave: string }} nivel en español y clave CSS
 */
export function obtenerNivel(exposicion) {
  if (exposicion <= 4)  return { nivel: 'Bajo',    clave: 'bajo' };
  if (exposicion <= 9)  return { nivel: 'Medio',   clave: 'medio' };
  if (exposicion <= 16) return { nivel: 'Alto',    clave: 'alto' };
  return                       { nivel: 'Crítico', clave: 'critico' };
}

/**
 * Genera el próximo ID de riesgo basado en los riesgos existentes.
 * @param {Array} riesgos - Lista actual de riesgos
 * @returns {string} Nuevo ID, ej. "R-001"
 */
export function generarId(riesgos) {
  if (!riesgos || riesgos.length === 0) return 'R-001';
  const numeros = riesgos.map(r => {
    const match = r.id.match(/^R-(\d+)$/);
    return match ? parseInt(match[1], 10) : 0;
  });
  const maximo = Math.max(...numeros);
  return `R-${String(maximo + 1).padStart(3, '0')}`;
}
