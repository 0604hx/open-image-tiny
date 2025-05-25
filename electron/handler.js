const { app, ipcMain } = require("electron")

const isDev = !app.isPackaged

const registerInvoke = (items)=> {
    for(let k in items){
        ipcMain.handle(k, async (...args)=>{
            try{
                return Promise.resolve(items[k](...args))
            }catch(e){
                console.error(`调用 ${k} 处理器出错`, e)
                throw e
            }
        })
        isDev && console.info(`注册处理器 ${k}`)
    }
}

const handlers = {
    /**
     *
     * @param {Electron.IpcMainInvokeEvent} e
     * @param {Number} max - 最大选择文件数
     * @param {String} accept - 支持的格式
     */
    'select-files': async (e, max=5, accept="")=>{

    }
}

module.exports = ()=>{
    registerInvoke(handlers)
}
