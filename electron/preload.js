const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("H", {
    open: path=> ipcRenderer.invoke('open', path),

    selectFiles: (accept)=> ipcRenderer.invoke("select-files", accept),

    convert: (path, config)=> ipcRenderer.invoke('convert', path, config),

    getEXIF: path=> ipcRenderer.invoke('exif', path)
})
