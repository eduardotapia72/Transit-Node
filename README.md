# TransitNode

TransitNode es una aplicación de escritorio desarrollada para el reconocimiento automático de matrículas (LPR - License Plate Recognition) de manera local. La aplicación está construida utilizando tecnologías web modernas empaquetadas en un entorno de escritorio mediante Electron.

## Estado Actual del Proyecto

Hasta el momento, se ha establecido la arquitectura base del proyecto y se ha implementado el diseño principal (Frontend) de la aplicación, integrando las vistas y componentes esenciales con un enfoque de diseño minimalista/neomórfico y soporte para temas dinámicos.

### Stack Tecnológico Instalado

*   **Frontend**: React 19, Vite, React Router DOM, Lucide React (para iconos).
*   **Contenedor de Escritorio**: Electron (Integrado con pre-carga y control de IPC).
*   **Estructura Backend**: 
    *   Directorios preparados para Node.js (`/backend/db`, `/backend/ipc`, `/backend/services`).
    *   Directorios preparados para el motor de reconocimiento en Python (`/python/api`, `/python/models`, `/python/scripts`).

### Características y Componentes Implementados

1.  **Ventana Personalizada (Electron + React)**
    *   Barra de título nativa oculta (`titleBarStyle: 'hidden'`) reemplazada por una barra de título personalizada dinámica (`Titlebar.jsx`).
    *   Sincronización de tema (Claro/Oscuro) entre la interfaz de React y los controles nativos de la ventana de Electron (botones de minimizar, maximizar, cerrar) a través de `ipcMain` y `ipcRenderer` (`electronAPI.setTheme`).

2.  **Sistema de Navegación y Estructura Principal**
    *   **Sidebar.jsx**: Barra lateral de navegación para cambiar entre módulos de la aplicación.
    *   **SettingsModal.jsx**: Modal superpuesto para la configuración de la aplicación (incluye el selector de temas Claro/Oscuro).
    *   Enrutamiento configurado de forma local con `HashRouter` para gestionar las páginas dentro de Electron.

3.  **Vistas Principales**
    *   **Sistema de Detección (Home - `DetectionSystem.jsx`)**:
        *   Interfaz funcional diseñada en dos columnas.
        *   Área central de previsualización multimedia, ajustada a formato 16:9 soportado con *Container Queries*.
        *   Área interactiva de *Drag & Drop* para cargar imágenes o videos, con un diseño moderno.
        *   Panel lateral derecho con la lista de "Resultados de la Lectura", la cual muestra matrículas detectadas, porcentajes de confianza y estado de éxito/error.
        *   Tarjetas informativas de resumen (Acentos Neomórficos) con el total de lecturas "Correctas" y con "Errores".
    *   **Base de Datos (`Database.jsx`)**:
        *   Interfaz orientada a visualizar el historial y estadísticas de las matrículas procesadas.
        *   Barra de herramientas superior provista de un campo de búsqueda por texto y un menú *dropdown* para el filtrado rápido por región o estado (Guanajuato, CDMX, Nuevo León, etc).
        *   Tabla minimalista para listado de registros (estáticos actualmente como maquetación) que incluye campos de Placa, Región y Fecha/Hora.
        *   Paginación UI integrada de estilo minimalista.

4.  **Estilos (UI / UX)**
    *   Sistema de diseño desarrollado en CSS puro (`index.css`), sustentado en variables (`--bg-app`, `--text-main`, `--color-500`, etc.).
    *   Gestión dinámica del modo visual (Claro/Oscuro) mediante la inserción del atributo `data-theme` desde el componente raíz `App.jsx`, lo que afecta a toda la cascada de estilos simultáneamente.

## 📁 Estructura de Carpetas

```text
/Tansit-Node
│
├── /frontend/              # Código fuente de componentes de Interfaz (React)
│   ├── /src/
│   │   ├── /components/    # Componentes modulares y reutilizables 
│   │   ├── /views/         # Vistas de página principales
│   │   ├── App.jsx         # Componente raíz y control de layout/tema
│   │   ├── main.jsx        # Punto de inyección de React
│   │   └── index.css       # Archivo de tokens de diseño y utilidades CSS
│   ├── index.html          # Plantilla base HTML del frontend
│   └── vite.config.js      # Configuración del compilador Vite
│
├── /backend/               # Capa lógica (Node.js) - *En preparación*
│   ├── /db/                # Controladores y modelos para la Base de Datos
│   ├── /ipc/               # Handlers de comunicación interprocesos
│   └── /services/          # Capa de Lógica de negocio Node
│
├── /python/                # Motor de Inferencia ALPR - *En preparación*
│   ├── /api/               # Scripts/APIs puente de Python
│   ├── /models/            # Redes neuronales y modelos de detección (e.g. YOLO)
│   └── /scripts/           # Scripts de prueba y procesamiento de visión
│
├── index.js                # Archivo principal de instanciación de Electron
├── preload.js              # Script de contexto IPC y exposición de APIs
└── package.json            # Manifest y gestor de dependencias / scripts
```

## Scripts de Inicialización (`package.json`)

*   `npm run dev`: Inicia el estado de desarrollo completo. Ejecuta el servidor UI de Vite y, concurrentemente, evalúa la disponibilidad del puerto para lanzar Electron conectado a esa instancia web (`http://localhost:5173`).
*   `npm run build`: Compila la app de React y la optimiza dentro de `/frontend/dist`.
*   `npm start`: Ejecuta el entorno de producción en Electron con los archivos ya distribuidos mediante Vite en local.
