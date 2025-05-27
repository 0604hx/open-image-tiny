const { join } = require('node:path')
const { app, protocol, BrowserWindow, Menu } = require('electron')
const registerHandler = require('./handler')

//不提示安全信息
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
protocol.registerSchemesAsPrivileged([ { scheme: 'app', privileges: { secure: true, standard: true } } ])

/**@type {BrowserWindow} */
let mainWindow  = null

/**
 * Restore existing BrowserWindow or Create new BrowserWindow
 */
async function restoreOrCreateWindow() {
    if (!mainWindow || !mainWindow.id)
        await createWindow()

    if (mainWindow.isMinimized())
        mainWindow.restore()

    mainWindow.focus()
}

async function createWindow() {
    Menu.setApplicationMenu(null)

    mainWindow = new BrowserWindow({
        width: 800,
        height: app.isPackaged?720:1020,
        show: true,
        webPreferences:{
            webSecurity: false,
            nativeWindowOpen: true,
            preload: join(__dirname, "preload.js")
        }
    })

    if(app.isPackaged)
        mainWindow.loadFile(join(__dirname, "../dist/index.html"))
    else
        mainWindow.loadURL("http://localhost:4000")

    if(!app.isPackaged){
        // 开发模式下自动打开F12
        mainWindow.on('ready-to-show', ()=> mainWindow.webContents.openDevTools())
    }

    if(process.platform === 'win32')
        app.setAppUserModelId("OPEN-IMAGE-TINY/开源图片压缩工具")
}


/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration()
app.on('window-all-closed', () => {
    console.debug(`所有窗口均关闭，即将退出程序...`)
    setTimeout(app.quit, 1000)
    // if (process.platform !== 'darwin'){
    // }
})
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) restoreOrCreateWindow()})
/**
 * 系统开启第二个实例时触发，通常用于伪协议响应
 */
app.on('second-instance', restoreOrCreateWindow)

app.whenReady().then(async ()=>{
    registerHandler()

    restoreOrCreateWindow()
    console.debug(`程序启动完成，enjoy ^.^`)
})
