const { splitImageVertical } = require("../tool");
const { IMG_PATH } = require("./abstract");

splitImageVertical(IMG_PATH, { height:80, fit: true }).then(d=>{
    console.debug(`切割${IMG_PATH}：`, d)
})
