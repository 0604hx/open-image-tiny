const { app, ipcMain, dialog, shell } = require("electron")
const { statSync } = require('node:fs')
const { basename } = require('node:path')
const sharp = require("sharp")
const { shotHash, convertFormat } = require("./tool")

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

/**
 * 读取指定图片的分辨率，经测试，读取 webp 格式的原图时，会造成资源被占用（程序关闭前，无法在资源管理器内删除）
 * @param {String} path
 * @returns
 */
const getImageSize = async path=>{
    const image = sharp(path)
    try {
        const { width, height, format } = await image.metadata()
        return { width, height, format }
    } finally {
        image.destroy()
    }
}

/**
 *
 * @param {Array<String>} files
 * @returns {Array<Object>}
 */
const readImgsInfo = async files=>{
    let datas = []
    for(let i=0;i<files.length;i++){
        let stat = statSync(files[i])
        let info = await getImageSize(files[i])

        datas.push({
            uuid    : shotHash(files[i]),
            name    : basename(files[i]),
            path    : files[i],
            time    : stat.mtimeMs,
            size    : stat.size,
            ...info
        })
    }
    return datas
}

const handlers = {
    'open': (e, path)=> shell.openPath(path),

    /**
     *
     * @param {Electron.IpcMainInvokeEvent} e
     * @param {Array<String>} accept - 支持的格式
     */
    'select-files': async (e, accept=["JPG","JPEG","PNG","WEBP","AVIF"])=>{
        let files = dialog.showOpenDialogSync({
            title: `选择图片`,
            filters: [{ name:"图片", extensions:accept }],
            properties: ['openFile','createDirectory', 'multiSelections']
        })

        return files ? await readImgsInfo(files): []
    },

    /**
     *
     * @param {Electron.IpcMainInvokeEvent} e
     * @param {String} filePath
     * @param {ConvertConfig} config
     */
    'convert': async (e, filePath, config)=>{
        console.debug("开始转换", filePath, config)
        let result = await convertFormat(filePath, null, config)
        return result
    }
}

module.exports = ()=>{
    registerInvoke(handlers)
}
