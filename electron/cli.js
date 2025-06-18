/**
 * 命令行调用
 */

const pkg = require('../package.json')

const { Command } = require("commander")
const pc = require('picocolors')
const { splitImageVertical, convertFormat } = require('./tool')

const toInt = v=>parseInt(v)

module.exports = async()=>{
    const cli = new Command()
    cli.command("convert <file>")
        .alias("c")
        .description(`转换图片格式（支持 ${pc.green("JPG/PNG/WEBP/AVIF")}）`)
        .option("-q, --quality [number]", "下载文件", toInt, 100 )
        .option("-t, --target [string]", "目标格式", "WebP")
        .option("--resize [string]", "裁剪方式，width=按宽度、height=按高度")
        .option("--resizeValue [number]", "裁剪大小/单位px", toInt)
        .option("-r, --rotate [number]", "旋转角度", toInt)
        .action(async (/**@type {String} */file, /**@type {import('./tool').ConvertConfig} */ps)=>{
            await convertFormat(file, null, ps)
        })

    cli.command("split <file>")
        .alias("s")
        .description("垂直切割图片")
        .option("-h, --height [number]", "切割高度/单位px", toInt, 1000)
        .option("-f, --fit [boolean]", "高度不足时自动填充", true)
        .option("-c, --color [string]", "填充高度", "#ffffff")
        .action(async (/**@type {String} */file, /**@type {import('./tool').SplitConfig} */ps)=>{
            await splitImageVertical(file, ps)
        })

    cli
        .name(pkg.name)
        .description(pkg.description)
        .version(pkg.version)
        .parseAsync()
        .catch(e=>console.error(`${pc.red("命令行执行出错：")}${e}`))
}
