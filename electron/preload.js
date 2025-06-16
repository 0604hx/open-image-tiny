const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("H", {
    // open: path=> ipcRenderer.invoke('open', path),

    // selectFiles: (accept)=> ipcRenderer.invoke("select-files", accept),

    // convert: (path, config)=> ipcRenderer.invoke('convert', path, config),

    // getEXIF: path=> ipcRenderer.invoke('exif', path),

    // selectDir: ()=> ipcRenderer.invoke("select-dir"),

    /**
     * 通用方法
     * @param {String} name
     * @param  {...any} ps
     * @returns
     */
    action: (name, ...ps)=> ipcRenderer.invoke(name, ...ps)
})
