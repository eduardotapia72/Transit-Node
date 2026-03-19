import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Titlebar() {
  const location = useLocation();
  
  // Determinamos el título en base a la ruta actual
  const title = location.pathname === '/database' 
    ? 'TransitNode - Base de Datos' 
    : 'TransitNode - LPR';

  return (
    <div className="titlebar">
      <span>{title}</span>
    </div>
  );
}
