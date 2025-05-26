const crypto = require('node:crypto')
const sharp = require('sharp')
const path = require('node:path')
const { statSync } = require('node:fs')

/**
 * @typedef {Object} ConvertConfig - 转换格式
 * @property {String} target - 目标格式
 * @property {Number} quality - 质量
 */

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
 * 转换图片格式
 * @param {String} origin
 * @param {String} target
 * @param {ConvertConfig} config
 */
exports.convertFormat = async (origin, target, config)=>{
    const started = Date.now()
    const format = config.target.toLowerCase()
    const ext = path.extname(origin)

    if(`.${format}` == ext.toLowerCase()){
        console.debug(`${origin} 已经是 ${format} 格式，无需转换...`)
        return
    }

    if(!target){
        const dir = path.dirname(origin)
        const base = path.basename(origin, ext)
        target = path.join(dir, `${base}.${format}`)
    }

    let img = sharp(origin)
    try{
        await img.toFormat(format, { quality: config.quality }).toFile(target)
    }catch(e){
        img.destroy()
        let fail = e.message ?? e
        console.error(`转换出错`, fail)
        return { fail }
    }

    return { path: target, size: statSync(target).size, used: Date.now() - started }
}
