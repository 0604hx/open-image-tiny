const { convertFormat } = require("../tool");

convertFormat("C:/Users/admin/Desktop/头像.jpg", null, { target:'webp', quality: 80 })
    .then(result=>console.debug(result))
