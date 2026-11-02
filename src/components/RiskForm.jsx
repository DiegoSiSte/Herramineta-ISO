import React, { useState, useEffect } from 'react';
import { calcularExposicion, obtenerNivel } from '../utils/riskCalc';

const CATEGORIAS = ['Requisitos', 'Estimación', 'Personal', 'Técnico', 'Seguridad', 'Organizacional', 'Externo'];
const ESTRATEGIAS = ['Evitar', 'Mitigar', 'Transferir', 'Aceptar'];
const ESTADOS = ['Identificado', 'En tratamiento', 'Mitigado', 'Cerrado'];

const RIESGO_VACIO = {
  descripcion: '',
  categoria: 'Técnico',
  causa: '',
  consecuencia: '',
  probabilidad: 3,
  impacto: 3,
  estrategia: 'Mitigar',
  accion: '',
  responsable: '',
  estado: 'Identificado',
};

export default function RiskForm({ onGuardar, onCancelar, riesgoInicial }) {
  const [form, setForm] = useState(riesgoInicial || RIESGO_VACIO);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    setForm(riesgoInicial || RIESGO_VACIO);
    setErrores({});
  }, [riesgoInicial]);

  const exposicion = calcularExposicion(Number(form.probabilidad), Number(form.impacto));
  const { nivel, clave } = obtenerNivel(exposicion);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }));
  }

  function validar() {
    const nuevosErrores = {};
    if (!form.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es requerida';
    if (!form.causa.trim()) nuevosErrores.causa = 'La causa es requerida';
    if (!form.consecuencia.trim()) nuevosErrores.consecuencia = 'La consecuencia es requerida';
    if (!form.accion.trim()) nuevosErrores.accion = 'El plan de acción es requerido';
    if (!form.responsable.trim()) nuevosErrores.responsable = 'El responsable es requerido';
    return nuevosErrores;
  }

  function manejarEnvio(e) {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }
    onGuardar({
      ...form,
      probabilidad: Number(form.probabilidad),
      impacto: Number(form.impacto),
    });
  }

  const esEdicion = !!riesgoInicial;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={esEdicion ? 'Editar riesgo' : 'Nuevo riesgo'}>
      <div className="modal-contenido">
        <div className="modal-encabezado">
          <h2 className="modal-titulo">{esEdicion ? `Editar ${riesgoInicial.id}` : 'Nuevo Riesgo'}</h2>
          <button className="btn-cerrar" onClick={onCancelar} aria-label="Cerrar formulario">✕</button>
        </div>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="form-grid">
            {/* Descripción */}
            <div className="form-grupo form-grupo-completo">
              <label htmlFor="descripcion" className="form-label">
                Descripción del riesgo
                <span className="form-ayuda"> — Existe la posibilidad de que...</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className={`form-input form-textarea ${errores.descripcion ? 'form-input-error' : ''}`}
                value={form.descripcion}
                onChange={manejarCambio}
                rows={2}
                placeholder="Ej: Existe la posibilidad de que el módulo WiFi falle en campo"
              />
              {errores.descripcion && <span className="form-error-msg">{errores.descripcion}</span>}
            </div>

            {/* Categoría */}
            <div className="form-grupo">
              <label htmlFor="categoria" className="form-label">Categoría</label>
              <select id="categoria" name="categoria" className="form-input form-select" value={form.categoria} onChange={manejarCambio}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Estado */}
            <div className="form-grupo">
              <label htmlFor="estado" className="form-label">Estado</label>
              <select id="estado" name="estado" className="form-input form-select" value={form.estado} onChange={manejarCambio}>
                {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Causa */}
            <div className="form-grupo form-grupo-completo">
              <label htmlFor="causa" className="form-label">Causa raíz</label>
              <textarea
                id="causa"
                name="causa"
                className={`form-input form-textarea ${errores.causa ? 'form-input-error' : ''}`}
                value={form.causa}
                onChange={manejarCambio}
                rows={2}
                placeholder="¿Por qué podría ocurrir este riesgo?"
              />
              {errores.causa && <span className="form-error-msg">{errores.causa}</span>}
            </div>

            {/* Consecuencia */}
            <div className="form-grupo form-grupo-completo">
              <label htmlFor="consecuencia" className="form-label">Consecuencia</label>
              <textarea
                id="consecuencia"
                name="consecuencia"
                className={`form-input form-textarea ${errores.consecuencia ? 'form-input-error' : ''}`}
                value={form.consecuencia}
                onChange={manejarCambio}
                rows={2}
                placeholder="¿Qué impacto tendría si ocurre?"
              />
              {errores.consecuencia && <span className="form-error-msg">{errores.consecuencia}</span>}
            </div>

            {/* Probabilidad e Impacto */}
            <div className="form-grupo">
              <label htmlFor="probabilidad" className="form-label">Probabilidad (1-5)</label>
              <div className="escala-control">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`escala-btn ${Number(form.probabilidad) === v ? 'escala-btn-activo' : ''}`}
                    onClick={() => manejarCambio({ target: { name: 'probabilidad', value: v } })}
                    aria-label={`Probabilidad ${v}`}
                    aria-pressed={Number(form.probabilidad) === v}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-grupo">
              <label htmlFor="impacto" className="form-label">Impacto (1-5)</label>
              <div className="escala-control">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`escala-btn ${Number(form.impacto) === v ? 'escala-btn-activo' : ''}`}
                    onClick={() => manejarCambio({ target: { name: 'impacto', value: v } })}
                    aria-label={`Impacto ${v}`}
                    aria-pressed={Number(form.impacto) === v}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Exposición calculada */}
            <div className="form-grupo form-grupo-completo">
              <div className="exposicion-preview">
                <span className="exposicion-label">Exposición calculada:</span>
                <span className="exposicion-valor">{exposicion}</span>
                <span className={`badge badge-${clave}`}>{nivel}</span>
              </div>
            </div>

            {/* Estrategia */}
            <div className="form-grupo">
              <label htmlFor="estrategia" className="form-label">Estrategia de respuesta</label>
              <select id="estrategia" name="estrategia" className="form-input form-select" value={form.estrategia} onChange={manejarCambio}>
                {ESTRATEGIAS.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Responsable */}
            <div className="form-grupo">
              <label htmlFor="responsable" className="form-label">Responsable</label>
              <input
                id="responsable"
                name="responsable"
                type="text"
                className={`form-input ${errores.responsable ? 'form-input-error' : ''}`}
                value={form.responsable}
                onChange={manejarCambio}
                placeholder="Nombre o rol"
              />
              {errores.responsable && <span className="form-error-msg">{errores.responsable}</span>}
            </div>

            {/* Acción */}
            <div className="form-grupo form-grupo-completo">
              <label htmlFor="accion" className="form-label">Plan de acción</label>
              <textarea
                id="accion"
                name="accion"
                className={`form-input form-textarea ${errores.accion ? 'form-input-error' : ''}`}
                value={form.accion}
                onChange={manejarCambio}
                rows={2}
                placeholder="¿Qué se hará para tratar este riesgo?"
              />
              {errores.accion && <span className="form-error-msg">{errores.accion}</span>}
            </div>
          </div>

          <div className="modal-acciones">
            <button type="button" className="btn btn-secundario" onClick={onCancelar}>Cancelar</button>
            <button type="submit" className="btn btn-primario">
              {esEdicion ? 'Guardar cambios' : 'Crear riesgo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
