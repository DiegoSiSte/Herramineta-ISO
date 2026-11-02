import React, { useState } from 'react';
import { calcularExposicion, obtenerNivel } from '../utils/riskCalc';

const CATEGORIAS_FILTRO = ['Todas', 'Requisitos', 'Estimación', 'Personal', 'Técnico', 'Seguridad', 'Organizacional', 'Externo'];
const NIVELES_FILTRO = ['Todos', 'Bajo', 'Medio', 'Alto', 'Crítico'];
const ESTADOS_FILTRO = ['Todos', 'Identificado', 'En tratamiento', 'Mitigado', 'Cerrado'];

export default function RiskTable({ riesgos, onEditar, onEliminar }) {
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroNivel, setFiltroNivel] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const riesgosProcesados = riesgos
    .map(r => {
      const exposicion = calcularExposicion(r.probabilidad, r.impacto);
      const { nivel, clave } = obtenerNivel(exposicion);
      return { ...r, exposicion, nivel, clave };
    })
    .filter(r => {
      if (filtroCategoria !== 'Todas' && r.categoria !== filtroCategoria) return false;
      if (filtroNivel !== 'Todos' && r.nivel !== filtroNivel) return false;
      if (filtroEstado !== 'Todos' && r.estado !== filtroEstado) return false;
      return true;
    })
    .sort((a, b) => b.exposicion - a.exposicion);

  function confirmarEliminar(riesgo) {
    const confirmado = window.confirm(
      `¿Eliminar el riesgo "${riesgo.id}: ${riesgo.descripcion.slice(0, 60)}..."?\n\nEsta acción no se puede deshacer.`
    );
    if (confirmado) onEliminar(riesgo.id);
  }

  return (
    <section className="seccion" aria-label="Tabla de riesgos">
      <div className="seccion-encabezado">
        <h2 className="seccion-titulo">📋 Registro de Riesgos</h2>
        <span className="badge-conteo">{riesgosProcesados.length} / {riesgos.length} riesgo{riesgos.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filtros */}
      <div className="filtros" role="group" aria-label="Filtros de riesgos">
        <div className="filtro-grupo">
          <label htmlFor="filtro-categoria" className="filtro-label">Categoría</label>
          <select
            id="filtro-categoria"
            className="filtro-select"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
          >
            {CATEGORIAS_FILTRO.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filtro-grupo">
          <label htmlFor="filtro-nivel" className="filtro-label">Nivel</label>
          <select
            id="filtro-nivel"
            className="filtro-select"
            value={filtroNivel}
            onChange={e => setFiltroNivel(e.target.value)}
          >
            {NIVELES_FILTRO.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="filtro-grupo">
          <label htmlFor="filtro-estado" className="filtro-label">Estado</label>
          <select
            id="filtro-estado"
            className="filtro-select"
            value={filtroEstado}
            onChange={e => setFiltroEstado(e.target.value)}
          >
            {ESTADOS_FILTRO.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        {(filtroCategoria !== 'Todas' || filtroNivel !== 'Todos' || filtroEstado !== 'Todos') && (
          <button
            className="btn btn-ghost"
            onClick={() => { setFiltroCategoria('Todas'); setFiltroNivel('Todos'); setFiltroEstado('Todos'); }}
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {riesgosProcesados.length === 0 ? (
        <div className="tabla-vacia">
          <p>{riesgos.length === 0 ? 'No hay riesgos registrados. Crea el primero o carga el caso de ejemplo.' : 'Ningún riesgo coincide con los filtros aplicados.'}</p>
        </div>
      ) : (
        <div className="tabla-contenedor">
          <table className="tabla" aria-label="Lista de riesgos priorizados">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Descripción</th>
                <th scope="col">Categoría</th>
                <th scope="col" className="col-centrado">P</th>
                <th scope="col" className="col-centrado">I</th>
                <th scope="col" className="col-centrado">Exp.</th>
                <th scope="col">Nivel</th>
                <th scope="col">Estado</th>
                <th scope="col">Responsable</th>
                <th scope="col" className="col-acciones">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {riesgosProcesados.map(r => (
                <tr key={r.id} className={`fila-riesgo fila-${r.clave}`}>
                  <td className="td-id">{r.id}</td>
                  <td className="td-descripcion" title={r.descripcion}>{r.descripcion}</td>
                  <td><span className="tag-categoria">{r.categoria}</span></td>
                  <td className="col-centrado">{r.probabilidad}</td>
                  <td className="col-centrado">{r.impacto}</td>
                  <td className="col-centrado td-exposicion">{r.exposicion}</td>
                  <td><span className={`badge badge-${r.clave}`}>{r.nivel}</span></td>
                  <td><span className={`estado-pill estado-${r.estado.toLowerCase().replace(' ', '-')}`}>{r.estado}</span></td>
                  <td className="td-responsable">{r.responsable}</td>
                  <td className="col-acciones">
                    <button
                      className="btn-icono btn-editar"
                      onClick={() => onEditar(r)}
                      aria-label={`Editar riesgo ${r.id}`}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icono btn-eliminar"
                      onClick={() => confirmarEliminar(r)}
                      aria-label={`Eliminar riesgo ${r.id}`}
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
