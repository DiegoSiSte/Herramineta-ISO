import React from 'react';
import { calcularExposicion, obtenerNivel } from '../utils/riskCalc';

const NIVELES = [
  { clave: 'critico', label: 'Crítico', color: 'critico' },
  { clave: 'alto',    label: 'Alto',    color: 'alto' },
  { clave: 'medio',   label: 'Medio',   color: 'medio' },
  { clave: 'bajo',    label: 'Bajo',    color: 'bajo' },
];

export default function Summary({ riesgos }) {
  const riesgosProcesados = riesgos.map(r => {
    const exposicion = calcularExposicion(r.probabilidad, r.impacto);
    const { nivel, clave } = obtenerNivel(exposicion);
    return { ...r, exposicion, nivel, clave };
  });

  const conteoNivel = { bajo: 0, medio: 0, alto: 0, critico: 0 };
  riesgosProcesados.forEach(r => { conteoNivel[r.clave]++; });

  const top3 = [...riesgosProcesados]
    .sort((a, b) => b.exposicion - a.exposicion)
    .slice(0, 3);

  const conteoEstado = {};
  riesgos.forEach(r => {
    conteoEstado[r.estado] = (conteoEstado[r.estado] || 0) + 1;
  });

  const maxConteo = Math.max(...NIVELES.map(n => conteoNivel[n.clave]), 1);

  return (
    <section className="seccion" aria-label="Resumen del proyecto">
      <div className="seccion-encabezado">
        <h2 className="seccion-titulo">📊 Resumen del Proyecto</h2>
      </div>

      <div className="resumen-grid">
        {/* Total */}
        <div className="resumen-tarjeta resumen-total">
          <span className="resumen-numero">{riesgos.length}</span>
          <span className="resumen-etiqueta">Riesgos totales</span>
        </div>

        {/* Por nivel */}
        {NIVELES.map(({ clave, label, color }) => (
          <div key={clave} className={`resumen-tarjeta resumen-nivel-${color}`}>
            <span className="resumen-numero">{conteoNivel[clave]}</span>
            <span className="resumen-etiqueta">{label}</span>
          </div>
        ))}
      </div>

      {/* Gráfico de barras por nivel (Fase 2 - sin librerías) */}
      {riesgos.length > 0 && (
        <div className="grafico-barras" aria-label="Gráfico de barras por nivel">
          <h3 className="grafico-titulo">Distribución por nivel</h3>
          <div className="grafico-area">
            {NIVELES.map(({ clave, label }) => (
              <div key={clave} className="grafico-item">
                <div className="grafico-barra-contenedor">
                  <span className="grafico-valor">{conteoNivel[clave]}</span>
                  <div
                    className={`grafico-barra grafico-barra-${clave}`}
                    style={{ height: `${(conteoNivel[clave] / maxConteo) * 100}%` }}
                    role="img"
                    aria-label={`${label}: ${conteoNivel[clave]} riesgo${conteoNivel[clave] !== 1 ? 's' : ''}`}
                  />
                </div>
                <span className="grafico-etiqueta">{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 3 */}
      {top3.length > 0 && (
        <div className="top3">
          <h3 className="top3-titulo">🏆 Top 3 — Mayor exposición</h3>
          <div className="top3-lista">
            {top3.map((r, idx) => (
              <div key={r.id} className={`top3-item top3-item-${r.clave}`}>
                <span className="top3-puesto">#{idx + 1}</span>
                <div className="top3-info">
                  <div className="top3-encabezado">
                    <span className="top3-id">{r.id}</span>
                    <span className={`badge badge-${r.clave}`}>{r.nivel}</span>
                    <span className="top3-exposicion">Exp. {r.exposicion}</span>
                  </div>
                  <p className="top3-descripcion">{r.descripcion}</p>
                  <span className="top3-responsable">👤 {r.responsable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado general */}
      {riesgos.length > 0 && (
        <div className="resumen-estados">
          <h3 className="resumen-estados-titulo">Estado del plan</h3>
          <div className="estados-lista">
            {Object.entries(conteoEstado).map(([estado, count]) => (
              <div key={estado} className="estado-resumen-item">
                <span className={`estado-pill estado-${estado.toLowerCase().replace(' ', '-')}`}>{estado}</span>
                <span className="estado-resumen-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
