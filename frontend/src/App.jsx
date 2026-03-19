import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Titlebar from './components/Titlebar';
import Sidebar from './components/Sidebar';
import SettingsModal from './components/SettingsModal';
import DetectionSystem from './views/DetectionSystem';
import Database from './views/Database';

export default function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  
  // Theme management: light / dark
  const [theme, setTheme] = useState('light');

  // Change data-theme attribute on <html> element when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    
    // Si la API de electron está disponible (a través de preload), actualiza los colores de los botones de ventana
    if (window.electronAPI) {
      window.electronAPI.setTheme(theme);
    }
  }, [theme]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <div className="app-container">
        {/* Barra superior de Electron gestionada por React */}
        <Titlebar />

        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
          openSettings={() => setSettingsOpen(true)}
        />

        {/* Main Workspace Minimalist */}
        <main style={{ flex: 1, paddingRight: '20px', paddingBottom: '20px', display: 'flex' }}>
          {/* Ya no usamos neo-inset aquí, dejamos que fluya sobre el fondo minimalista */}
          <div style={{ flex: 1, borderRadius: '24px', overflow: 'hidden', display: 'flex' }}>
            <Routes>
              <Route path="/" element={<DetectionSystem />} />
              <Route path="/database" element={<Database />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Settings Modal (Overlay) */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </Router>
  );
}
