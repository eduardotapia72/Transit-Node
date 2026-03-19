import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Camera, Database, Settings } from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, openSettings }) {
  // Variables dinámicas para el estado de la barra (abierta / cerrada)
  const sidebarWidth = isOpen ? '210px' : '80px';
  const buttonPadding = isOpen ? '10px 16px' : '10px';
  const buttonJustify = isOpen ? 'flex-start' : 'center';

  return (
    <aside 
      className="card-minimal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: sidebarWidth,
        margin: '0 10px 20px 20px',
        padding: '24px 12px',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        zIndex: 50,
        boxShadow: 'none',
        borderRadius: '16px'
      }}
    >
      {/* Toggle Button */}
      <div style={{ display: 'flex', justifyContent: isOpen ? 'flex-end' : 'center', marginBottom: '16px' }}>
        <button className="btn-flat" onClick={toggleSidebar} style={{ padding: '10px' }}>
          <Menu 
            size={24} 
            color="var(--text-muted)" 
            style={{ flexShrink: 0, minWidth: '24px' }} 
          />
        </button>
      </div>

      <div style={{
          height: '1px',
          background: 'var(--border-color)',
          marginBottom: '24px',
        }}
      />

      {/* Navegación Centro */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `btn-flat ${isActive ? 'active' : ''}`}
          style={{ justifyContent: buttonJustify, padding: buttonPadding }}
        >
          {/* Añadimos flexShrink para que los SVG no se hagan pequeños al contraer */}
          <Camera size={22} color="currentcolor" style={{ flexShrink: 0, minWidth: '22px' }} />
          {isOpen && <span style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}>Detección LPR</span>}
        </NavLink>

        <NavLink 
          to="/database" 
          className={({ isActive }) => `btn-flat ${isActive ? 'active' : ''}`}
          style={{ justifyContent: buttonJustify, padding: buttonPadding }}
        >
          <Database size={22} color="currentcolor" style={{ flexShrink: 0, minWidth: '22px' }} />
          {isOpen && <span style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}>Base de Datos</span>}
        </NavLink>
      </div>

      {/* Settings Bottom */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column' }}>
        <button 
          className="btn-flat" 
          onClick={openSettings}
          style={{ justifyContent: buttonJustify, padding: buttonPadding }}
        >
          <Settings size={22} color="currentcolor" style={{ flexShrink: 0, minWidth: '22px' }} />
          {isOpen && <span style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}>Ajustes</span>}
        </button>
      </div>
    </aside>
  );
}
