const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  setTheme: (theme) => ipcRenderer.send('update-theme', theme)
})

contextBridge.exposeInMainWorld('dbAPI', {
  savePlate: (data) => ipcRenderer.invoke('db:savePlate', data),
  getRecentPlates: (limit, offset, search, region) => ipcRenderer.invoke('db:getRecentPlates', limit, offset, search, region),
  searchPlate: (plateNumber) => ipcRenderer.invoke('db:searchPlate', plateNumber),
  decryptImage: (filePath) => ipcRenderer.invoke('db:decryptImage', filePath),
  getTotalPlates: (search, region) => ipcRenderer.invoke('db:getTotalPlates', search, region)
})

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron
})
