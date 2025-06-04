const sharp = require("sharp");
const { IMG_PATH } = require("./abstract");
const { readExif } = require("../tool");

const file = IMG_PATH // "C:/Users/admin/Desktop/柳州20250601.jpg"

// sharp(file).metadata().then(async d=>{
//     console.debug(`${file} 图片属性：`, d)
//     const { exif, icc, xmp } = d

//     exif && console.debug(`EXIF`, d.exif)
//     icc && console.debug(`ICC`, icc)
//     xmp && console.debug(`XMP`, xmp)
// })
readExif(file).then(console.debug)
