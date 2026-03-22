# TransitNode

TransitNode es una aplicación de escritorio de grado Enterprise desarrollada para el reconocimiento automático de matrículas (LPR - License Plate Recognition) de manera local. Combina un potente backend en Node.js/Python con un frontend moderno construido en React 19 y empaquetado mediante Electron.

## Estado Actual del Proyecto

Se ha superado satisfactoriamente la etapa de cimentación estructural UI/UX. Actualmente, la aplicación web está sólidamente conectada con el proceso principal nativo de su sistema operativo (Electron) a través de canales IPC seguros, y posee un engranaje completo y operativo de base de datos relacional (SQLite), manipulación del FileSystem, encriptación física de imágenes, y lectura avanzada de periféricos de hardware (Cámaras USB/IP).

### Stack Tecnológico Principal

*   **Frontend**: React 19, Vite, React Router DOM, Lucide React.
*   **Contenedor de Escritorio**: Electron (Preload context isolation `contextBridge`).
*   **Motor de Base de Datos**: `better-sqlite3` (Implementación relacional síncrona ultra veloz).
*   **Seguridad y Archivos**: Módulo Nativo `crypto` (AES-256-CBC) y `fs` de Node.js.

### Características y Componentes Desarrollados

1. **Arquitectura de Base de Datos y Persistencia (Backend)**
   *   Inicialización automática de la tabla relacional `plates` con índices (`idx_plates_plateNumber`) para búsquedas veloces.
   *   Generador automático estocástico de matrículas simuladas (Seeder `database.exec()`) operando mediante *Batches transaccionales*.
   *   Métricas completas con paginación optimizada usando `OFFSET` y `LIMIT` con retornos matemáticos manejados por Node.

2. **Capa de Seguridad (Encriptación)**
   *   Servicio dedicado `cryptoService.js` en el backend.
   *   **Almacenamiento Zero-Trust**: Las imágenes fotográficas de los vehículos capturados jamás tocan la base de datos de manera cruda. Son recibidas, transformadas en buffers, encriptadas matemáticamente mediante algoritmo `AES-256-CBC` y guardadas físicamente en los ficheros protegidos del usuario (`app.getPath('userData')`). SQLite solo almacena la ruta de descifrado y sus metadatos.
   *   Decodificación al vuelo bajo demanda (Base64) solo cuando el frontend requiere proyectar la imagen en el UI.

3. **Puente de Comunicación Inteligente (IPC)**
   *   Creación de canales en `preload.js` (`dbAPI.getRecentPlates`, `dbAPI.getTotalPlates`, etc).
   *   Manejo de promesas asíncronas seguras entre el Thread UI (React) y el Thread Main (Node).

4. **Sistema de Detección e Ingesta de Medios**
   *   Motor lógico de *Drag & Drop* complejo con validaciones MIME Type para imágenes y videos locales.
   *   **Hub Extendido de Hardware Visual**: Modal flotante construido desde cero para la selección minuciosa de flujos.
   *   Escaneo directo del Hardware del PC vía `navigator.mediaDevices.enumerateDevices()` para capturar nombres reales de Lentes / Redes integradas / Webcams USB.
   *   Modo espejo virtual implementado vía flujos `RAW`.
   *   Compatibilidad de Red para la inyección de **Cámaras IP / Servidores DVR** locales mediante protocolos limpios tipo HTTP/MJPEG.
   *   Sistema automático de corte de energía de hardware al cerrar las previsualizaciones para ahorrar batería y respetar la privacidad.

5. **Panel Interactivo de Base de Datos y Búsqueda**
   *   Algoritmo frontal para cálculo dinámico del UI de Paginación (`< [1] [...] [x] >`).
   *   **Buscador Fuzzy (Filtros Activos SQL)**: Integración de filtros de texto que Node.js canaliza directamente como instrucciones `LIKE %abc%` para coincidencias parciales ultrarrápidas, sumado a un selector Dropdown conteniendo los 32 Estados Libres y Soberanos de la República Mexicana.
   *   Intercepción de tecla `Enter` y separadores de estado (`searchInput` temporal vs `activeSearch`) para proteger al motor SQLite de saturación indeseada, disparando el recálculo y volviendo incondicionalmente a la Página 1 de resultados.

6. **Diseño, Layout y UX**
   *   Transición a modo *"Enterprise Minimalist"*: Sidebar rígidamente comprimida e iconográfica (`80px`), operando únicamente de forma simbólica, delegándole la información escrita a los metadatos OS nativos (`Titles`).
   *   Container Queries inteligentes y elásticos para prevenir la asfixia del contenido `Flexbox` cuando la ventana se contrae o cambia drásticamente.
   *   Sistema de variables CSS central (`index.css`) orquestando el `data-theme` claro y oscuro de manera global y en perfecta sincronía semántica con la renderización del borde de la Barra de Título provista por Electron.

## 📁 Estructura de Carpetas Actualizada

```text
/Tansit-Node
│
├── /frontend/              # Código fuente de componentes de Interfaz (React)
│   ├── /src/
│   │   ├── /components/    # Sidebar, Modal, TitleBar 
│   │   ├── /views/         # DetectionSystem.jsx, Database.jsx
│   │   ├── App.jsx         # Componente raíz inteligente
│   │   └── index.css       # Archivo maestro de variables Dark/Light
│
├── /backend/               # Capa Lógica y FileSystems (Node.js)
│   ├── /db/                
│   │   └── database.js     # Controlador SQLite, generadores y Query builder
│   │
│   └── /services/          
│       └── cryptoService.js # Motor Criptográfico AES-256
│
├── /python/                # Motor de deteccion de placas LPR - *(Pendiente a Integar)*
│   ├── /api/               
│   ├── /models/            
│   └── /scripts/           
│
├── index.js                # Instancia de Electron y Handlers (ipcMain)
├── preload.js              # Script de Context Bridge y Security UI
└── package.json            
```

## Próximos Pasos (Roadmap Inmediato)

*   Conectar el Buffer fotográfico capturado (Frontend) en LPR Python Engine como `stdin` o vía API HTTP interna.
*   Procesamiento final OCR en Python (YOLOv8 + EasyOCR) devolviendo la Placa de vuelta a React.
*   Consolidar la base de datos con capturas 100% reales enviadas por `dbAPI.savePlate()`.
