const multer = require("multer");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'public/img')
    },
    filename: (req, file, cb) =>{
        cb(null, Date.now() + path.extname(file.originalname)); //o nome de como eu quero salvar o nome de cada imagem, tem que ser unico
    }
});

module.exports = diskStorage;