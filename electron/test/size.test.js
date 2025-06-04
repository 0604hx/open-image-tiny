const { readImgSize } = require("../tool")
const { IMG_PATH } = require("./abstract")

readImgSize(IMG_PATH).then(console.debug)
