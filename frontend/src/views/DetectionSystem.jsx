import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Image as ImageIcon, Video, X } from 'lucide-react';

export default function DetectionSystem() {
  const [dragActive, setDragActive] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', 'webcam' o 'ip_camera'
  const [stream, setStream] = useState(null);
  const inputRef = useRef(null);
  const videoRef = useRef(null);

  // --- Estados del Modal de Selección de Cámaras ---
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [cameraMode, setCameraMode] = useState('local'); // 'local' o 'ip'
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [ipCameraUrl, setIpCameraUrl] = useState('');

  // Auto-conectar el flujo de video crudo al elemento web
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, mediaType]);

  // --- Lógica del Sistema de Cámaras Avanzado ---

  const openCameraModal = async () => {
    setIsCameraModalOpen(true);
    
    // Solicitamos acceso fugaz para que Chromium desbloquee los nombres reales ("labels") del hardware
    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
      tempStream.getTracks().forEach(track => track.stop());
    } catch(e) {
      console.warn("No se pudo obtener el permiso nativo o no hay sensores.");
    }

    // Listamos minuciosamente todas las cámaras (Lentes integrados, Capturadoras HDMI, USB Cams)
    const devicesList = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devicesList.filter(d => d.kind === 'videoinput');
    setDevices(videoDevices);
    
    if (videoDevices.length > 0) {
      setSelectedDeviceId(videoDevices[0].deviceId);
    }
  };

  const startWebcam = async () => {
    try {
      const constraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId }, width: 1280, height: 720 } : { width: 1280, height: 720 }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setMediaType('webcam');
      setMediaPreview(null);
      setIsCameraModalOpen(false);
    } catch (err) {
      console.error("Error al acceder a la cámara seleccionada:", err);
      alert("No se pudo encender la cámara. Revisa si está desconectada o usada por otro software.");
    }
  };

  const startIpCamera = () => {
    if (!ipCameraUrl) return;
    setMediaType('ip_camera');
    setMediaPreview(ipCameraUrl);
    setStream(null);
    setIsCameraModalOpen(false);
  };

  // --- Lógica del Drag and Drop ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    
    // Validar visualmente el MIME Type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (!isImage && !isVideo) {
      alert('Por favor sube solo imágenes o videos.');
      return;
    }

    setMediaType(isImage ? 'image' : 'video');

    // Leer archivo nativo de memoria hacia una URL de Data (Base64)
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target.result);
      // MÁS ADELANTE: Aquí despacharemos e.target.result al ALPR python engine
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onSelectFileClick = () => inputRef.current.click();

  const clearMedia = (e) => {
    e?.stopPropagation();
    
    // Si la cámara web estaba prendida, la apagamos para que no se quede la luz encendida en tu laptop
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    setMediaPreview(null);
    setMediaType(null);
    setIpCameraUrl('');
    if(inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <div className="view-container" style={{ flexDirection: 'row', gap: '32px', overflowX: 'auto' }}>
      
      {/* Sección Izquierda*/}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 0, minWidth: '400px' }}>
        <h2 style={{ margin: 0, color: 'var(--color-600)', fontSize: '1.5rem', fontWeight: '600', flexShrink: 0 }}>Sistema de Detección</h2>
        
        {/* Previsualización mantenida a 16:9 con Container Queries matemáticas */}
        <div style={{ flex: 1, minHeight: 0, containerType: 'size', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div 
            className="card-minimal"
            style={{
              width: 'min(100cqi, calc(100cqb * 16 / 9))',
              height: 'min(100cqb, calc(100cqi * 9 / 16))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'var(--bg-app)', position: 'relative', overflow: 'hidden'
            }}
          >
            {mediaPreview || mediaType === 'webcam' || mediaType === 'ip_camera' ? (
              // Si hay archivo o cámara web viva, muestra el player interactivo
              <>
                <button 
                  onClick={clearMedia}
                  style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: 'rgba(15, 23, 42, 0.7)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <X size={18} />
                </button>
                
                {mediaType === 'image' && (
                  <img src={mediaPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
                {mediaType === 'video' && (
                  <video src={mediaPreview} controls autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
                {mediaType === 'webcam' && (
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scaleX(-1)' }} />
                )}
                {mediaType === 'ip_camera' && (
                  // Las cámaras IP por lo general mandan flujos de imagenes infinitas MJPEG, 
                  // las cuales React y HTML soportan leer superbién incrustadas en un tag de imagen.
                  <img src={mediaPreview} alt="Cámara IP Remota" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                )}
              </>
            ) : (
              // Si no hay archivo, muestra el placeholder
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <ImageIcon size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
                <p style={{ margin: 0, fontSize: '0.9rem' }}>El archivo multimedia aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Controles de Carga */}
        <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
          {/* Drag & Drop Area Operativa */}
          <div 
            className="neo-accent-inset"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onSelectFileClick}
            style={{
              flex: 1,
              height: '140px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              border: `2px dashed ${dragActive ? 'var(--color-500)' : 'var(--color-400)'}`, 
              backgroundColor: dragActive ? 'rgba(142, 51, 255, 0.05)' : 'transparent',
              padding: '20px', transition: 'all 0.2s ease'
            }}
          >
            {/* Input fantasma escondido pero vital para los clicks */}
            <input 
              ref={inputRef} 
              type="file" 
              style={{ display: 'none' }} 
              accept="image/*,video/*" 
              onChange={handleChange} 
            />
            <div style={{ background: dragActive ? 'var(--color-500)' : 'var(--color-50)', width: '64px', height: '64px', minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, marginBottom: '12px', transition: 'all 0.2s ease', boxShadow: dragActive ? '0 4px 12px rgba(142,51,255,0.3)' : 'none' }}>
              <UploadCloud size={32} color={dragActive ? '#FFF' : 'var(--color-500)'} />
            </div>
            <p style={{ margin: 0, fontWeight: '500', color: dragActive ? 'var(--color-600)' : 'var(--text-muted)' }}>
              {dragActive ? "¡Suelta tu archivo ahora!" : <>Arrastra tu imagen/video aquí o <span style={{ color: 'var(--color-500)', textDecoration: 'underline' }}>haz clic</span></>}
            </p>
          </div>

          {/* Botón Cámaras en Vivo (Operativo con click) */}
          <div 
            className="card-minimal"
            onClick={openCameraModal}
            style={{
              width: '180px',
              height: '140px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              padding: '20px', transition: 'all 0.2s ease',
              border: (mediaType === 'webcam' || mediaType === 'ip_camera') ? '2px solid var(--color-500)' : '1px solid var(--border-color)',
              boxShadow: (mediaType === 'webcam' || mediaType === 'ip_camera') ? '0 0 0 3px rgba(142, 51, 255, 0.15)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-500)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(142, 51, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
            }}
          >
            <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', width: '64px', height: '64px', minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, marginBottom: '12px' }}>
              <Video size={32} color="var(--text-muted)" />
            </div>
            <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-main)', textAlign: 'center', fontSize: '0.95rem' }}>
              Cámaras en vivo
            </p>
          </div>
        </div>
      </div>

      {/* Sección Derecha: */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Lista de placas (Card) */}
        <div className="card-minimal" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Resultados de la Lectura
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            {/* Estado Vacío */}
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '60px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay lecturas recientes en esta sesión.</p>
            </div>
          </div>
        </div>

        {/* Resumen Counters (Acentos Neomórficos) */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="neo-accent" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-success)', lineHeight: '1' }}>0</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Correctas</div>
          </div>
          
          <div className="neo-accent" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-error)', lineHeight: '1' }}>0</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Errores</div>
          </div>
        </div>
      </div>

    </div>
    
      {/* ========================================================= */}
      {/* ====== MODAL DE GESTIÓN AVANZADA DE CÁMARAS ============= */}
      {/* ========================================================= */}
      {isCameraModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div className="card-minimal" style={{ width: '420px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', border: '1px solid var(--border-color)' }}>
            
            {/* Header del Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.2rem', fontWeight: '600' }}>Conectar Cámara</h3>
              <button 
                onClick={() => setIsCameraModalOpen(false)} 
                style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <X size={18} />
              </button>
            </div>
            
            {/* Pestañas Neomórficas */}
            <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-app)', padding: '6px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => setCameraMode('local')}
                style={{ flex: 1, padding: '10px', border: 'none', background: cameraMode === 'local' ? 'var(--color-500)' : 'transparent', color: cameraMode === 'local' ? '#FFF' : 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s', fontSize: '0.9rem' }}
              >
                USB / Integrada
              </button>
              <button 
                onClick={() => setCameraMode('ip')}
                style={{ flex: 1, padding: '10px', border: 'none', background: cameraMode === 'ip' ? 'var(--color-500)' : 'transparent', color: cameraMode === 'ip' ? '#FFF' : 'var(--text-muted)', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.2s', fontSize: '0.9rem' }}
              >
                URL (Cámara IP)
              </button>
            </div>

            {/* Contenido Dinámico de la Pestaña */}
            {cameraMode === 'local' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Selecciona tu hardware visual:</label>
                  <select 
                    className="input-minimal" 
                    value={selectedDeviceId} 
                    onChange={e => setSelectedDeviceId(e.target.value)}
                    style={{ width: '100%', cursor: 'pointer', appearance: 'none', background: 'var(--bg-app)' }}
                  >
                    {devices.length === 0 && <option value="">Detectando periféricos...</option>}
                    {devices.map((device, idx) => (
                      <option key={device.deviceId} value={device.deviceId}>
                        {device.label || `Cámara Genérica ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="btn-primary" onClick={startWebcam} disabled={devices.length === 0} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem', marginTop: '8px' }}>
                  Conectar Sensor Local
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>Ruta de transmisión (HTTP / MJPEG stream):</label>
                  <input 
                    type="text" 
                    className="input-minimal" 
                    placeholder="Ej: http://192.168.1.15:8080/video" 
                    value={ipCameraUrl}
                    onChange={e => setIpCameraUrl(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg-app)' }}
                  />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '12px', marginBottom: 0, lineHeight: '1.4' }}>
                    * Compatible de forma nativa con servidores en red local tipo "Motion JPEG". Ingresa la dirección IP directa del video.
                  </p>
                </div>
                <button className="btn-primary" onClick={startIpCamera} disabled={!ipCameraUrl} style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem', marginTop: '8px' }}>
                  Añadir Fuente de Red
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
