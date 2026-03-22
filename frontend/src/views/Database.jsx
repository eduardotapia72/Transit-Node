import React, { useState, useEffect } from 'react';
import { Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Database() {
  const [plates, setPlates] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estados visuales de los inputs
  const [searchInput, setSearchInput] = useState('');
  const [regionInput, setRegionInput] = useState('');
  
  // Estados "activos" que SQLite realmente obedece cuando se presiona "Filtrar"
  const [activeSearch, setActiveSearch] = useState('');
  const [activeRegion, setActiveRegion] = useState('');
  
  // Modificado a 9 registros por página como capacidad base.
  const LIMIT_PER_PAGE = 9;

  // Cada vez que se monte la vista Database o cambie algún filtro activo, jalamos los datos
  useEffect(() => {
    async function loadPlates() {
      if (window.dbAPI) {
        setLoading(true);
        try {
          const offset = (page - 1) * LIMIT_PER_PAGE;
          // Solicitamos datos al IPC enviando los filtros actuales
          const recent = await window.dbAPI.getRecentPlates(LIMIT_PER_PAGE, offset, activeSearch, activeRegion);
          setPlates(recent);
  
          const totalCount = await window.dbAPI.getTotalPlates(activeSearch, activeRegion);
          setTotalPages(Math.max(1, Math.ceil(totalCount / LIMIT_PER_PAGE))); // Prevenir paginas cero
        } catch (error) {
          console.error("Error cargando placas de la DB:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    loadPlates();
  }, [page, activeSearch, activeRegion]);

  // Controlador del Botón Filtrar
  const handleFilter = () => {
    setActiveSearch(searchInput);
    setActiveRegion(regionInput);
    setPage(1); // Regresamos al inicio del historial cuando se busca algo nuevo
  };

  // Lógica para renderizar los números de página inteligentemente
  const getPaginationGroup = () => {
    if (totalPages === 0) return [];
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Limite visible
    if (page <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    } else if (page >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [1, '...', page - 1, page, page + 1, '...', totalPages];
    }
  };

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
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilter()} // Acceso rápido
          />
        </div>

        {/* Filtro Dropdown */}
        <div style={{ position: 'relative', width: '220px' }}>
          <MapPin size={20} color="var(--color-500)" style={{ position: 'absolute', left: '16px', top: '10px', zIndex: 10 }} />
          <select 
            className="input-minimal" 
            style={{ paddingLeft: '44px', appearance: 'none', cursor: 'pointer', background: 'var(--bg-panel)' }}
            value={regionInput}
            onChange={(e) => setRegionInput(e.target.value)}
          >
            <option value="">Todas las regiones</option>
            <option value="Aguascalientes">Aguascalientes</option>
            <option value="Baja California">Baja California</option>
            <option value="Baja California Sur">Baja California Sur</option>
            <option value="Campeche">Campeche</option>
            <option value="Chiapas">Chiapas</option>
            <option value="Chihuahua">Chihuahua</option>
            <option value="CDMX">CDMX</option>
            <option value="Coahuila">Coahuila</option>
            <option value="Colima">Colima</option>
            <option value="Durango">Durango</option>
            <option value="Edo. Mex">Edo. Mex</option>
            <option value="Guanajuato">Guanajuato</option>
            <option value="Guerrero">Guerrero</option>
            <option value="Hidalgo">Hidalgo</option>
            <option value="Jalisco">Jalisco</option>
            <option value="Michoacán">Michoacán</option>
            <option value="Morelos">Morelos</option>
            <option value="Nayarit">Nayarit</option>
            <option value="Nuevo León">Nuevo León</option>
            <option value="Oaxaca">Oaxaca</option>
            <option value="Puebla">Puebla</option>
            <option value="Querétaro">Querétaro</option>
            <option value="Quintana Roo">Quintana Roo</option>
            <option value="San Luis Potosí">San Luis Potosí</option>
            <option value="Sinaloa">Sinaloa</option>
            <option value="Sonora">Sonora</option>
            <option value="Tabasco">Tabasco</option>
            <option value="Tamaulipas">Tamaulipas</option>
            <option value="Tlaxcala">Tlaxcala</option>
            <option value="Veracruz">Veracruz</option>
            <option value="Yucatán">Yucatán</option>
            <option value="Zacatecas">Zacatecas</option>
          </select>
          <div style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none', borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--text-muted)' }} />
        </div>
        
        {/* Botón Primario */}
        <button 
          className="btn-primary" 
          style={{ padding: '0 32px' }}
          onClick={handleFilter}
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Filtrar Datos'}
        </button>

      </div>

      {/* Tarjeta de Datos de la Tabla Minimalista */}
      <div className="card-minimal" style={{ flex: 1, padding: '0', overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', zIndex: 20 }}>
            <tr style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Número de Placa</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Región</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Fuente</th>
              <th style={{ padding: '16px 24px', fontWeight: '600' }}>Fecha y Hora</th>
            </tr>
          </thead>
          <tbody>
            {plates.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No se encontraron resultados en la Base de Datos para tu búsqueda.
                </td>
              </tr>
            ) : (
              plates.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s ease', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-app)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontWeight: '600', color: 'var(--text-main)', background: 'var(--bg-app)', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'inline-block' }}>
                      {item.plateNumber}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>
                    {item.region || 'Desconocida'}
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {item.source_type === 'ip_camera' ? 'Cámara IP' : 
                     item.source_type === 'webcam' ? 'Webcam' : 
                     item.source_type === 'video_file' ? 'Video' : 
                     item.source_type === 'image_upload' ? 'Imagen' : 
                     item.source_type || 'Desconocida'}
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(item.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación Numérica Interactiva */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '24px' }}>
        
        {/* Flecha Izquierda */}
        <button 
          className="btn-flat" 
          style={{ padding: '8px', border: '1px solid var(--border-color)', opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft size={18} />
        </button>
        
        {/* Números dinámicos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', margin: '0 8px' }}>
          {getPaginationGroup().map((item, index) => (
            item === '...' ? (
              <span key={index} style={{ color: 'var(--text-muted)', margin: '0 4px', userSelect: 'none' }}>...</span>
            ) : (
              <button 
                key={index}
                className={`btn-flat ${page === item ? 'active' : ''}`}
                style={{ width: '36px', height: '36px', padding: 0 }}
                onClick={() => setPage(item)}
              >
                {item}
              </button>
            )
          ))}
        </div>
        
        {/* Flecha Derecha */}
        <button 
          className="btn-flat" 
          style={{ padding: '8px', border: '1px solid var(--border-color)', opacity: page === totalPages ? 0.3 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          <ChevronRight size={18} />
        </button>
        
      </div>

    </div>
  );
}
