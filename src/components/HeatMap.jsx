import React from 'react';
import { calcularExposicion, obtenerNivel } from '../utils/riskCalc';

/**
 * HeatMap — Matriz de calor 5x5
 * Eje X: Impacto (1-5, izquierda a derecha)
 * Eje Y: Probabilidad (5-1, arriba a abajo)
 */
export default function HeatMap({ riesgos }) {
  // Construir mapa: { "prob-imp": [ids] }
  const mapa = {};
  riesgos.forEach(r => {
    const clave = `${r.probabilidad}-${r.impacto}`;
    if (!mapa[clave]) mapa[clave] = [];
    mapa[clave].push(r.id);
  });

  // Filas: probabilidad 5→1 (de arriba hacia abajo)
  const filasProbabilidad = [5, 4, 3, 2, 1];
  // Columnas: impacto 1→5 (de izquierda a derecha)
  const columnasImpacto = [1, 2, 3, 4, 5];

  return (
    <section className="seccion" aria-label="Matriz de calor de riesgos">
      <div className="seccion-encabezado">
        <h2 className="seccion-titulo">🔥 Matriz de Calor</h2>
      </div>

      <div className="heatmap-contenedor">
        {/* Eje Y label */}
        <div className="heatmap-eje-y-label" aria-hidden="true">
          <span>Probabilidad</span>
        </div>

        <div className="heatmap-area">
          {/* Números del eje Y */}
          <div className="heatmap-eje-y">
            {filasProbabilidad.map(p => (
              <div key={p} className="heatmap-eje-numero">{p}</div>
            ))}
          </div>

          {/* Grid de celdas */}
          <div className="heatmap-grid" role="grid" aria-label="Matriz probabilidad vs impacto">
            {filasProbabilidad.map(prob => (
              <div key={prob} className="heatmap-fila" role="row">
                {columnasImpacto.map(imp => {
                  const exposicion = calcularExposicion(prob, imp);
                  const { clave, nivel } = obtenerNivel(exposicion);
                  const ids = mapa[`${prob}-${imp}`] || [];
                  return (
                    <div
                      key={imp}
                      className={`heatmap-celda heatmap-celda-${clave} ${ids.length > 0 ? 'heatmap-celda-activa' : ''}`}
                      role="gridcell"
                      aria-label={`Probabilidad ${prob}, Impacto ${imp}: nivel ${nivel}, exposición ${exposicion}${ids.length > 0 ? `, riesgos: ${ids.join(', ')}` : ''}`}
                      title={`P${prob} × I${imp} = ${exposicion} (${nivel})${ids.length > 0 ? '\n' + ids.join(', ') : ''}`}
                    >
                      <span className="heatmap-exp" aria-hidden="true">{exposicion}</span>
                      {ids.length > 0 && (
                        <div className="heatmap-ids">
                          {ids.map(id => (
                            <span key={id} className="heatmap-id-chip">{id}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Eje X: impacto */}
          <div className="heatmap-eje-x">
            {columnasImpacto.map(i => (
              <div key={i} className="heatmap-eje-numero">{i}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap-eje-x-label" aria-hidden="true">
        <span>Impacto →</span>
      </div>

      {/* Leyenda */}
      <div className="heatmap-leyenda" aria-label="Leyenda de niveles">
        {[
          { clave: 'bajo', label: 'Bajo (1-4)' },
          { clave: 'medio', label: 'Medio (5-9)' },
          { clave: 'alto', label: 'Alto (10-16)' },
          { clave: 'critico', label: 'Crítico (17-25)' },
        ].map(({ clave, label }) => (
          <div key={clave} className="leyenda-item">
            <span className={`leyenda-color heatmap-celda-${clave}`} aria-hidden="true"></span>
            <span className="leyenda-texto">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
