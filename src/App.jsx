import React, { useState, useEffect, useCallback } from 'react';
import RiskForm from './components/RiskForm';
import RiskTable from './components/RiskTable';
import HeatMap from './components/HeatMap';
import ResponsePlan from './components/ResponsePlan';
import Summary from './components/Summary';
import { cargarRiesgos, guardarRiesgos } from './utils/storage';
import { generarId } from './utils/riskCalc';
import { riesgoEjemplo } from './data/sampleRisks';
import './styles.css';

const TABS = [
  { id: 'tabla',    label: '📋 Registro',   titulo: 'Registro de Riesgos' },
  { id: 'heatmap',  label: '🔥 Matriz',     titulo: 'Matriz de Calor' },
  { id: 'plan',     label: '📝 Respuesta',  titulo: 'Plan de Respuesta' },
  { id: 'resumen',  label: '📊 Resumen',    titulo: 'Resumen' },
];

export default function App() {
  const [riesgos, setRiesgos] = useState(() => cargarRiesgos());
  const [tabActiva, setTabActiva] = useState('tabla');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [riesgoEditando, setRiesgoEditando] = useState(null);

  // Persistir en localStorage al cambiar riesgos
  useEffect(() => {
    guardarRiesgos(riesgos);
  }, [riesgos]);

  const handleCrear = useCallback(() => {
    setRiesgoEditando(null);
    setMostrarFormulario(true);
  }, []);

  const handleEditar = useCallback((riesgo) => {
    setRiesgoEditando(riesgo);
    setMostrarFormulario(true);
  }, []);

  const handleGuardar = useCallback((datosFormulario) => {
    setRiesgos(prev => {
      if (riesgoEditando) {
        // Edición
        return prev.map(r => r.id === riesgoEditando.id ? { ...r, ...datosFormulario } : r);
      } else {
        // Creación
        const nuevoId = generarId(prev);
        return [...prev, {
          ...datosFormulario,
          id: nuevoId,
          probResidual: null,
          impactoResidual: null,
        }];
      }
    });
    setMostrarFormulario(false);
    setRiesgoEditando(null);
  }, [riesgoEditando]);

  const handleEliminar = useCallback((id) => {
    setRiesgos(prev => prev.filter(r => r.id !== id));
  }, []);

  const handleCancelar = useCallback(() => {
    setMostrarFormulario(false);
    setRiesgoEditando(null);
  }, []);

  const handleActualizarEstado = useCallback((id, nuevoEstado) => {
    setRiesgos(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
  }, []);

  const handleCargarEjemplo = useCallback(() => {
    const confirmado = riesgos.length === 0 || window.confirm(
      'Cargar el caso de ejemplo reemplazará todos los riesgos actuales. ¿Continuar?'
    );
    if (confirmado) setRiesgos(riesgoEjemplo);
  }, [riesgos.length]);

  const handleBorrarTodo = useCallback(() => {
    if (riesgos.length === 0) return;
    const confirmado = window.confirm(
      `¿Borrar todos los ${riesgos.length} riesgo${riesgos.length !== 1 ? 's' : ''}? Esta acción no se puede deshacer.`
    );
    if (confirmado) setRiesgos([]);
  }, [riesgos.length]);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-contenido">
          <div className="header-marca">
            <span className="header-icono" aria-hidden="true">⚠️</span>
            <div>
              <h1 className="header-titulo">Gestión de Riesgos</h1>
              <p className="header-subtitulo">Ingeniería de Software II — UNIFRANZ</p>
            </div>
          </div>
          <div className="header-acciones">
            <button
              className="btn btn-ghost"
              onClick={handleCargarEjemplo}
              title="Cargar el caso de ejemplo: Basurero Inteligente"
            >
              📂 Caso de ejemplo
            </button>
            <button
              className="btn btn-peligro-ghost"
              onClick={handleBorrarTodo}
              disabled={riesgos.length === 0}
              title="Eliminar todos los riesgos"
            >
              🗑️ Borrar todo
            </button>
            <button
              id="btn-nuevo-riesgo"
              className="btn btn-primario"
              onClick={handleCrear}
            >
              + Nuevo riesgo
            </button>
          </div>
        </div>
      </header>

      {/* Navegación por tabs */}
      <nav className="tabs-nav" aria-label="Secciones de la aplicación">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            className={`tab-btn ${tabActiva === tab.id ? 'tab-btn-activo' : ''}`}
            onClick={() => setTabActiva(tab.id)}
            role="tab"
            aria-selected={tabActiva === tab.id}
            aria-controls={`panel-${tab.id}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Contenido principal */}
      <main className="contenido-principal">
        <div id="panel-tabla" role="tabpanel" aria-labelledby="tab-tabla" hidden={tabActiva !== 'tabla'}>
          <RiskTable riesgos={riesgos} onEditar={handleEditar} onEliminar={handleEliminar} />
        </div>
        <div id="panel-heatmap" role="tabpanel" aria-labelledby="tab-heatmap" hidden={tabActiva !== 'heatmap'}>
          <HeatMap riesgos={riesgos} />
        </div>
        <div id="panel-plan" role="tabpanel" aria-labelledby="tab-plan" hidden={tabActiva !== 'plan'}>
          <ResponsePlan riesgos={riesgos} onActualizarEstado={handleActualizarEstado} />
        </div>
        <div id="panel-resumen" role="tabpanel" aria-labelledby="tab-resumen" hidden={tabActiva !== 'resumen'}>
          <Summary riesgos={riesgos} />
        </div>
      </main>

      {/* Modal formulario */}
      {mostrarFormulario && (
        <RiskForm
          riesgoInicial={riesgoEditando}
          onGuardar={handleGuardar}
          onCancelar={handleCancelar}
        />
      )}
    </div>
  );
}
