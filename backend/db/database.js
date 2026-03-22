const Database = require('better-sqlite3');
const { app } = require('electron');
const path = require('path');
const cryptoService = require('../services/cryptoService');

// 1. Obtener la ruta segura del sistema operativo
// En Windows esto apuntará a: C:\Users\<Usuario>\AppData\Roaming\transit-node\transit_node.sqlite
// Esto previene errores de permisos en producción y evita que se borre si reinstalas o actualizas la app.
const userDataPath = app.getPath('userData');
const dbPath = path.join(userDataPath, 'transit_node.sqlite');

// 2. Inicializar la conexión a la base de datos
// verbose ayuda en desarrollo a ver las queries ejecutadas en consola
const db = new Database(dbPath, { verbose: console.log });

// Optimizar la Base de Datos para lecturas/escrituras concurrentes rapidísimas
db.pragma('journal_mode = WAL');

// 3. Crear las tablas si no existen
db.exec(`
  -- Tabla principal para los registros LPR
  CREATE TABLE IF NOT EXISTS plates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plateNumber TEXT NOT NULL,
    region TEXT,
    source_type TEXT,
    confidence REAL,
    imagePath TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabla para guardar valores de configuración de la app
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// 4. Mantenimiento: Crear índices SQL vitales
// Si el usuario busca la placa "ABC-123", el índice idx_plates_plateNumber permite que el motor 
// no lea las 50,000 filas (escaneo lineal), sino que vaya directo al bloque de esa placa en milisegundos.
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_plates_plateNumber ON plates(plateNumber);
  CREATE INDEX IF NOT EXISTS idx_plates_timestamp ON plates(timestamp);
`);

function seedTestData(database) {
  // Preparar la consulta para contar filas de forma extremadamente eficiente en SQLite
  const rowCount = database.prepare('SELECT COUNT(*) as count FROM plates').get();

  // Si la tabla no está vacía y ya tiene bastantes registros, no sembramos de más
  if (rowCount.count >= 20) return;
  
  // Limpiamos cualquier prueba previa para inyectar la carga pesada limpia
  database.exec('DELETE FROM plates');

  console.log("🚦 Generando 26 registros ALPR falsos (Batch) para paginación avanzada...");

  // Creamos la transacción síncrona
  const insertMock = database.prepare(`
    INSERT INTO plates (plateNumber, region, source_type, confidence, imagePath, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  // Las operaciones batch (múltiples INSERTS) dentro de un transaction() en better-sqlite3 
  // toman literalmente fracciones de milisegundo.
  const insertMany = database.transaction((captures) => {
    for (const car of captures) {
      insertMock.run(car.plateNumber, car.region, car.source_type, car.confidence, car.imagePath, car.timestamp);
    }
  });

  // Fabricamos 6 datos de prueba estáticos
  const mockData = [
    { plateNumber: 'CDMX-999', region: 'CDMX', source_type: 'ip_camera', confidence: 99.8, imagePath: '', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { plateNumber: 'GTO-112', region: 'Guanajuato', source_type: 'video_file', confidence: 85.3, imagePath: '', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { plateNumber: 'JAL-456', region: 'Jalisco', source_type: 'webcam', confidence: 91.0, imagePath: '', timestamp: new Date(Date.now() - 14400000).toISOString() },
    { plateNumber: 'EDM-007', region: 'Edomex', source_type: 'ip_camera', confidence: 78.5, imagePath: '', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { plateNumber: 'NL-888', region: 'Nuevo León', source_type: 'image_upload', confidence: 96.2, imagePath: '', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { plateNumber: 'CDMX-123', region: 'CDMX', source_type: 'webcam', confidence: 94.7, imagePath: '', timestamp: new Date().toISOString() },
  ];

  // Adicionamos 20 registros extra dinámicamente con un loop para que no pese el código fuente
  const regions = ['CDMX', 'Guanajuato', 'Jalisco', 'Edomex', 'Nuevo León', 'Coahuila', 'Querétaro', 'Veracruz', 'Michoacán'];
  const sources = ['ip_camera', 'video_file', 'webcam', 'image_upload'];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 20; i++) {
    const l1 = letters[Math.floor(Math.random() * 26)];
    const l2 = letters[Math.floor(Math.random() * 26)];
    const l3 = letters[Math.floor(Math.random() * 26)];
    const num = Math.floor(Math.random() * 900) + 100;
    
    mockData.push({
      plateNumber: `${l1}${l2}${l3}-${num}`,
      region: regions[Math.floor(Math.random() * regions.length)],
      source_type: sources[Math.floor(Math.random() * sources.length)],
      confidence: Math.floor(Math.random() * 150 + 850) / 10, // Genera entre 85.0 y 99.9
      imagePath: '',
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 2500000000)).toISOString() // Tiempos aleatorios en un rango de dias
    });
  }

  insertMany(mockData);
  console.log("26 Datos inyectados exitosamente.");
}

// Variables de entorno de Electron para saber si estamos corriendo localmente o si el cliente ya instaló el .exe
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Solo sembramos basura de prueba
if (isDev) {
  seedTestData(db);
}

// ==============================================
// 5. Funciones de Acceso a Datos (Controladores)
// ==============================================

/**
 * Guarda un registro LPR procesando la imagen de forma segura.
 */
function savePlateRecord(data) {
  const { plateNumber, region, source_type, confidence, imageBase64 } = data;
  
  // 1. Encriptar y guardar la imagen en disco
  // Creamos un nombre de archivo único usando la fecha y limpiando la placa de caracteres extraños
  const safePlateName = plateNumber.replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `${Date.now()}_${safePlateName}`;
  const encryptedPath = cryptoService.encryptAndSaveImage(imageBase64, fileName);
  
  // 2. Insertar solo los metadatos en la Base de Datos
  const insertStmt = db.prepare(`
    INSERT INTO plates (plateNumber, region, source_type, confidence, imagePath)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = insertStmt.run(plateNumber, region, source_type, confidence, encryptedPath);
  return result.lastInsertRowid; // Devuelve el ID generado
}

/**
 * Devuelve un bloque de registros recientes (Paginación y Filtrado optimizado).
 */
function getRecentPlates(limit = 50, offset = 0, searchTerm = '', regionFilter = '') {
  let query = 'SELECT * FROM plates WHERE 1=1';
  const params = [];

  if (searchTerm) {
    query += ' AND plateNumber LIKE ?';
    params.push(`%${searchTerm.toUpperCase()}%`);
  }
  
  if (regionFilter) {
    query += ' AND region = ?';
    params.push(regionFilter);
  }

  query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  return db.prepare(query).all(...params);
}

/**
 * Búsqueda difusa súper veloz gracias al índice idx_plates_plateNumber
 */
function searchPlate(plateNumber) {
  const stmt = db.prepare('SELECT * FROM plates WHERE plateNumber LIKE ? ORDER BY timestamp DESC LIMIT 50');
  // Envolvemos el término de búsqueda con % para encontrar coincidencias parciales (ej. %123%)
  return stmt.all(`%${plateNumber}%`);
}

/**
 * Devuelve el total de filas para calcular la paginación de la UI.
 */
function getTotalPlates(searchTerm = '', regionFilter = '') {
  let query = 'SELECT COUNT(*) as count FROM plates WHERE 1=1';
  const params = [];

  if (searchTerm) {
    query += ' AND plateNumber LIKE ?';
    params.push(`%${searchTerm.toUpperCase()}%`);
  }
  
  if (regionFilter) {
    query += ' AND region = ?';
    params.push(regionFilter);
  }

  const result = db.prepare(query).get(...params);
  return result.count;
}

// 6. Exportar la instancia vital de SQLite y los nuevos controladores
module.exports = {
  db,
  savePlateRecord,
  getRecentPlates,
  searchPlate,
  getTotalPlates
};
