import React from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, Database, Settings } from 'lucide-react';

export default function Sidebar({ openSettings }) {
  return (
    <aside 
      className="card-minimal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '80px',
        minWidth: '80px',
        flexShrink: 0,
        margin: '0 10px 20px 20px',
        padding: '24px 12px',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        zIndex: 50,
        boxShadow: 'none',
        borderRadius: '16px'
      }}
    >
      {/* Navegación Centro Permanente */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', paddingTop: '16px' }}>
        <NavLink 
          to="/" 
          title="Detección LPR"
          className={({ isActive }) => `btn-flat ${isActive ? 'active' : ''}`}
          style={{ padding: '12px', borderRadius: '12px' }}
        >
          <Camera size={24} color="currentcolor" style={{ flexShrink: 0 }} />
        </NavLink>

        <NavLink 
          to="/database" 
          title="Base de Datos"
          className={({ isActive }) => `btn-flat ${isActive ? 'active' : ''}`}
          style={{ padding: '12px', borderRadius: '12px' }}
        >
          <Database size={24} color="currentcolor" style={{ flexShrink: 0 }} />
        </NavLink>
      </div>

      {/* Ajustes Abajo */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <button 
          className="btn-flat" 
          title="Ajustes del Sistema"
          onClick={openSettings}
          style={{ padding: '12px', borderRadius: '12px' }}
        >
          <Settings size={24} color="currentcolor" style={{ flexShrink: 0 }} />
        </button>
      </div>
    </aside>
  );
}
