const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

// Oculta la advertencia de CSP en la consola durante el desarrollo con Vite
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#F8FAFC',         // Color claro inicial temporal
      symbolColor: '#0F172A'
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

const db = require('./backend/db/database.js')

  // Escuchar el cambio de tema desde React y cambiar color de los botones (TitleBar)
  ipcMain.on('update-theme', (event, theme) => {
    if (theme === 'dark') {
      mainWindow.setTitleBarOverlay({
        color: '#0F172A',         // Fondo Oscuro
        symbolColor: '#F8FAFC'    // Iconos de control Claros
      })
    } else {
      mainWindow.setTitleBarOverlay({
        color: '#F8FAFC',         // Fondo Claro
        symbolColor: '#0F172A'    // Iconos de control Oscuros
      })
    }
  })

  // Conectar Backend con Frontend
  ipcMain.handle('db:getRecentPlates', (event, limit, offset, search, region) => db.getRecentPlates(limit, offset, search, region));
  ipcMain.handle('db:savePlate', (event, data) => db.savePlateRecord(data));
  ipcMain.handle('db:searchPlate', (event, plateNumber) => db.searchPlate(plateNumber));
  ipcMain.handle('db:getTotalPlates', (event, search, region) => db.getTotalPlates(search, region));
  
  // Ojo: cryptoService lo podemos importar directo aquí si hiciera falta.
  // Por ahora lo maneja database.js internamente para guardado, pero si
  // ocupas decryptImage() directo en frontend, tocará hacer require del cryptoService!


  // Si estamos en entorno de desarrollo, cargamos el servidor de Vite
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools() // Opcional: abre las devtools automáticamente
  } else {
    // Si estamos en producción, cargamos el archivo ya construido
    mainWindow.loadFile(path.join(__dirname, 'frontend/dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
