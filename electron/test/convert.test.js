const { convertFormat } = require("../tool");
const { IMG_PATH } = require("./abstract");

convertFormat(IMG_PATH, null, { target:'webp', quality: 80 })
    .then(result=>console.debug(result))
