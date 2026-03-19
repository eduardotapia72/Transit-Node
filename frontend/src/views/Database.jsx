import React from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Database() {
  return (
    <div className="view-container">
      <h2 style={{ margin: 0, color: 'var(--color-600)', fontSize: '1.5rem', fontWeight: '600', marginBottom: '8px' }}>Base de Datos del Sistema</h2>
      <p style={{ margin: 0, color: 'var(--text-muted)', marginBottom: '24px' }}>Historial y estadísticas de matrículas procesadas</p>
      
      {/* Barra de Herramientas Minimalista */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        
        {/* Búsqueda Flat */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Buscar por placa (Ej. ABC-123)" 
            className="input-minimal"
            style={{ paddingLeft: '44px' }}
          />
        </div>

        {/* Filtro Dropdown */}
        <div style={{ position: 'relative', width: '220px' }}>
          <MapPin size={20} color="var(--color-500)" style={{ position: 'absolute', left: '16px', top: '10px', zIndex: 10 }} />
          <select 
            className="input-minimal" 
            style={{ paddingLeft: '44px', appearance: 'none', cursor: 'pointer', background: 'var(--bg-panel)' }}
          >
            <option value="">Todas las regiones</option>
            <option value="cdmx">Ciudad de México (CDMX)</option>
            <option value="guanajuato">Guanajuato</option>
            <option value="jalisco">Jalisco</option>
            <option value="nuevo_leon">Nuevo León</option>
          </select>
          <div style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--text-muted)' }} />
        </div>
        
        {/* Botón Primario */}
        <button className="btn-primary" style={{ padding: '0 32px' }}>
          Filtrar Datos
        </button>

      </div>

      {/* Tarjeta de Datos de la Tabla Minimalista */}
      <div className="card-minimal" style={{ flex: 1, padding: '0', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', zIndex: 20 }}>
            <tr style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Número de Placa</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Región</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            
            {/* Filas Clean Minimalistas */}
            {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
              <tr key={item} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-app)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)', background: 'var(--bg-app)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                    {index % 2 === 0 ? 'ABC-123' : 'GTX-89'}{index}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>
                  {index % 2 === 0 ? 'CDMX' : 'Guanajuato'}
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  09/Mar/2026 14:32:0{item}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación Flat Minimalista */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
        <button className="btn-flat" style={{ padding: '8px', border: '1px solid var(--border-color)' }}><ChevronLeft size={18} /></button>
        <button className="btn-flat active" style={{ width: '36px', height: '36px', padding: 0 }}>1</button>
        <button className="btn-flat" style={{ width: '36px', height: '36px', padding: 0 }}>2</button>
        <button className="btn-flat" style={{ width: '36px', height: '36px', padding: 0 }}>3</button>
        <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>...</span>
        <button className="btn-flat" style={{ width: '36px', height: '36px', padding: 0 }}>45</button>
        <button className="btn-flat" style={{ padding: '8px', border: '1px solid var(--border-color)' }}><ChevronRight size={18} /></button>
      </div>

    </div>
  );
}
