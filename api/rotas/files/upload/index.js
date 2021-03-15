const multer = require('multer');
const path = require('path');
const roteador = require('express').Router();

/** 
 * Cria uma instância do middleware configurada:
 * - destination: lida com o destino
 * - filenane: permite definir o nome do arquivo gravado
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        /** Trocando o nome do arquivo */
        //cb(null, `${file.fieldname}-${Date.now()}.${path.extname(file.originalname)}`);
        /** Mesmo nome de arquivo */
        cb(null, file.originalname);
    }
});

/**
 * Utiliza o storage para configurar o multer
 */
const upload = multer({ storage });

/**
 * Rota que responde a um arquivo sendo enviado para a api
 */
roteador.post('/upload', upload.single('file'), (requsicao, resposta, proxima) => {
    try {
        resposta.status(200);
        resposta.send('<h2>Upload realizado com sucesso</h2>');
    } catch (erro) {
        proxima(erro);
    }
});

module.exports = roteador;