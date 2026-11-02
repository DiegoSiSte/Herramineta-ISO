import React, { useState } from 'react';
import { calcularExposicion, obtenerNivel } from '../utils/riskCalc';

const ESTRATEGIAS_INFO = {
  Evitar: { emoji: '🚫', descripcion: 'Eliminar la causa del riesgo o cambiar el plan para eliminarlo completamente.' },
  Mitigar: { emoji: '🛡️', descripcion: 'Reducir la probabilidad o el impacto del riesgo a un nivel aceptable.' },
  Transferir: { emoji: '🤝', descripcion: 'Trasladar el impacto a un tercero (seguro, contrato, outsourcing).' },
  Aceptar: { emoji: '✅', descripcion: 'Reconocer el riesgo y no tomar acción proactiva; documentar la decisión.' },
};

export default function ResponsePlan({ riesgos, onActualizarEstado }) {
  const [expandido, setExpandido] = useState(null);

  const riesgosProcesados = riesgos
    .map(r => {
      const exposicion = calcularExposicion(r.probabilidad, r.impacto);
      const { nivel, clave } = obtenerNivel(exposicion);
      return { ...r, exposicion, nivel, clave };
    })
    .sort((a, b) => b.exposicion - a.exposicion);

  function toggleExpandido(id) {
    setExpandido(prev => prev === id ? null : id);
  }

  if (riesgos.length === 0) {
    return (
      <section className="seccion" aria-label="Plan de respuesta">
        <div className="seccion-encabezado">
          <h2 className="seccion-titulo">📝 Plan de Respuesta</h2>
        </div>
        <div className="tabla-vacia">
          <p>No hay riesgos para mostrar. Crea riesgos para definir planes de respuesta.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion" aria-label="Plan de respuesta por riesgo">
      <div className="seccion-encabezado">
        <h2 className="seccion-titulo">📝 Plan de Respuesta</h2>
        <span className="badge-conteo">{riesgos.length} riesgo{riesgos.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="plan-lista">
        {riesgosProcesados.map(r => {
          const estaExpandido = expandido === r.id;
          const estrategiaInfo = ESTRATEGIAS_INFO[r.estrategia] || {};

          return (
            <div key={r.id} className={`plan-tarjeta plan-tarjeta-${r.clave}`}>
              {/* Cabecera colapsable */}
              <button
                className="plan-cabecera"
                onClick={() => toggleExpandido(r.id)}
                aria-expanded={estaExpandido}
                aria-controls={`plan-detalle-${r.id}`}
              >
                <div className="plan-cabecera-izquierda">
                  <span className="plan-id">{r.id}</span>
                  <span className="plan-descripcion-corta">{r.descripcion}</span>
                </div>
                <div className="plan-cabecera-derecha">
                  <span className={`badge badge-${r.clave}`}>{r.nivel}</span>
                  <span className="plan-estrategia-badge">{estrategiaInfo.emoji} {r.estrategia}</span>
                  <span className={`estado-pill estado-${r.estado.toLowerCase().replace(' ', '-')}`}>{r.estado}</span>
                  <span className="plan-chevron" aria-hidden="true">{estaExpandido ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Detalle expandible */}
              {estaExpandido && (
                <div id={`plan-detalle-${r.id}`} className="plan-detalle">
                  <div className="plan-grid">
                    <div className="plan-campo">
                      <span className="plan-campo-label">Exposición</span>
                      <span className="plan-campo-valor plan-exposicion">{r.exposicion}</span>
                    </div>
                    <div className="plan-campo">
                      <span className="plan-campo-label">Categoría</span>
                      <span className="plan-campo-valor">{r.categoria}</span>
                    </div>
                    <div className="plan-campo plan-campo-completo">
                      <span className="plan-campo-label">Causa raíz</span>
                      <span className="plan-campo-valor">{r.causa}</span>
                    </div>
                    <div className="plan-campo plan-campo-completo">
                      <span className="plan-campo-label">Consecuencia</span>
                      <span className="plan-campo-valor">{r.consecuencia}</span>
                    </div>
                    <div className="plan-campo plan-campo-completo plan-estrategia-info">
                      <span className="plan-campo-label">Estrategia: {estrategiaInfo.emoji} {r.estrategia}</span>
                      <span className="plan-campo-valor plan-estrategia-desc">{estrategiaInfo.descripcion}</span>
                    </div>
                    <div className="plan-campo plan-campo-completo">
                      <span className="plan-campo-label">Plan de acción</span>
                      <span className="plan-campo-valor plan-accion">{r.accion}</span>
                    </div>
                    <div className="plan-campo">
                      <span className="plan-campo-label">Responsable</span>
                      <span className="plan-campo-valor">{r.responsable}</span>
                    </div>
                    <div className="plan-campo">
                      <span className="plan-campo-label">Cambiar estado</span>
                      <select
                        className="plan-estado-select"
                        value={r.estado}
                        onChange={e => onActualizarEstado(r.id, e.target.value)}
                        aria-label={`Estado del riesgo ${r.id}`}
                      >
                        {['Identificado', 'En tratamiento', 'Mitigado', 'Cerrado'].map(est => (
                          <option key={est} value={est}>{est}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
