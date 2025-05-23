const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("H", {
    getVersion: ()=> "version is 1.0"
})
