const crypto = require('node:crypto')
const sharp = require('sharp')
const path = require('node:path')
const { statSync, writeFileSync } = require('node:fs')
const { PDFDocument } = require('pdf-lib')
const exifr = require('exifr')
const { imageSizeFromFile } = require('image-size/fromFile')

const PDF = "pdf"
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

/**
 * @typedef {Object} ConvertConfig - 转换格式
 * @property {String} target - 目标格式
 * @property {Number} quality - 质量
 * @property {Number} rotate - 旋转角度
 * @property {String} resize - 裁剪方式
 * @property {Number} resizeValue - 裁剪值
 * @property {String} dir - 存放目录
 */


/**
 * 图片转换为PDF
 * @param {sharp.Sharp} img
 * @param {String} target
 */
const toPdf = async (img, target)=>{
    const pdf = await PDFDocument.create()
    const page = pdf.addPage()

    const pdfImg = await pdf.embedJpg(await img.toBuffer())
    const { width, height } = pdfImg.scale(1)
    page.setSize(width, height)
    page.drawImage(pdfImg, { x:0, y:0, width, height })

    const pdfBytes = await pdf.save()
    writeFileSync(target, pdfBytes)
}

/**
 *
 * @param {String} text
 * @param {Number} len
 * @returns {String}
 */
exports.shotHash = (text, len=12)=>{
    const hash = crypto.createHash('sha1').update(text).digest('base64')
    return hash.replace(/[+/=]/g, '').slice(0, len)
}

/**
 *
 * @param {Number} length
 * @returns
 */
exports.randomAlphaNum =  (length = 3)=>{
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * 转换图片格式
 * @param {String} origin
 * @param {String} target
 * @param {ConvertConfig} config
 */
exports.convertFormat = async (origin, target, config)=>{
    const started = Date.now()
    const format = config.target.toLowerCase()
    const ext = path.extname(origin)

    // if(`.${format}` == ext.toLowerCase()){
    //     console.debug(`${origin} 已经是 ${format} 格式，无需转换...`)
    //     return
    // }

    if(!target){
        const dir = config.dir || path.dirname(origin)
        const base = path.basename(origin, ext)
        target = path.join(dir, `${base}.${format}`)
        // 判断是否文件同名
        if(target == origin){
            console.debug(`检测到源文件与目标文件一致，生成随机后缀...`)
            target = path.join(dir, `${base}_${this.randomAlphaNum()}.${format}`)
        }
    }

    let img = sharp(origin)
    try{
        if(config.rotate != null && !isNaN(config.rotate))
            img.rotate(config.rotate)
        if(config.resize && !isNaN(config.resizeValue)){
            let ps = { [config.resize]: config.resizeValue }
            img.resize({ fit:'inside', ...ps })
        }

        if(format == PDF)
            await toPdf(img, target)
        else
            await img.toFormat(format, { quality: config.quality }).toFile(target)

    }catch(e){
        img.destroy()
        let fail = e.message ?? e
        console.error(`转换出错`, fail)
        return { fail }
    }

    return { path: target, size: statSync(target).size, used: Date.now() - started }
}


/**
 * 读取指定图片的元数据
 * @param {String} file
 * @returns {Promise<Object>}
 */
exports.readExif = async file => await exifr.parse(file, { xmp: true })

/**
 * 使用 image-size 库读取图片宽高值
 * @param {String} file
 * @returns {Object}
 */
exports.readImgSize = async file=> {
    const result = await imageSizeFromFile(file)
    return { width: result.width, height: result.height, format: result.type }
}

/**
 * 读取指定图片的分辨率，经测试，读取 webp 格式的原图时，会造成资源被占用（程序关闭前，无法在资源管理器内删除）
 * @param {String} path
 * @returns
 */
// exports.readImgSizeWithSharp = async path=>{
//     const image = sharp(path)
//     try {
//         const { width, height, format } = await image.metadata()
//         return { width, height, format }
//     } finally {
//         image.destroy()
//     }
// }
