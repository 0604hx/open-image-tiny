const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("H", {
    getVersion: ()=> "version is 1.0",

    selectFiles: (max=5, accept="")=> ipcRenderer.invoke("select-files", max, accept)
})
