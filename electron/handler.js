const { app, ipcMain, dialog, shell } = require("electron")
const { statSync } = require('node:fs')
const { basename } = require('node:path')
const sharp = require("sharp")
const { shotHash, convertFormat, readImgSize, readExif } = require("./tool")

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
 *
 * @param {Array<String>} files
 * @returns {Array<Object>}
 */
const readImgsInfo = async files=>{
    let datas = []
    for(let i=0;i<files.length;i++){
        let stat = statSync(files[i])
        let info = await readImgSize(files[i])

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
        let result = await convertFormat(filePath, null, config)
        return result
    },

    /**
     * @param {Electron.IpcMainInvokeEvent} e
     * @param {String} path
     * @returns {Object}
     */
    'exif': async (e, path)=> await readExif(path)
}

module.exports = ()=>{
    registerInvoke(handlers)
}
