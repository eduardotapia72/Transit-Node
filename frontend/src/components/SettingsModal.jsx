import React from 'react';
import { Moon, Sun, X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, theme, toggleTheme }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="card-minimal" style={{ width: '400px', padding: '32px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        {/* Close Button Minimal */}
        <button className="btn-flat" onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px' }}>
          <X size={20} color="var(--text-muted)" />
        </button>

        <h2 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--color-600)', textAlign: 'center' }}>Ajustes del Sistema</h2>

        {/* Theme Toggle - Keep Neumorphic Accent for the Toggle Switch only */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <span style={{ fontSize: '18px', fontWeight: '500' }}>Modo Oscuro</span>
          
          <div 
            className="neo-accent-inset"
            style={{
              width: '60px', height: '30px', borderRadius: '15px', position: 'relative', cursor: 'pointer',
              display: 'flex', alignItems: 'center', padding: '0 5px'
            }}
            onClick={toggleTheme}
          >
            {/* Knob (Interruptor neumórfico acentuado) */}
            <div 
              className="neo-accent"
              style={{
                width: '24px', height: '24px', borderRadius: '50%',
                position: 'absolute',
                left: theme === 'dark' ? '32px' : '4px',
                transition: 'left 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {theme === 'dark' ? <Moon size={14} color="var(--color-400)" /> : <Sun size={14} color="#f59e0b" />}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
