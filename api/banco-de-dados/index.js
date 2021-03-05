const Sequelize = require('sequelize');
const config = require('config');

/**
 * Cria a conexão "agnóstica" com o SGBD
 * @see config\default.json
 */
const instancia = new Sequelize(
    config.get('sgbd.banco'),
    config.get('sgbd.usuario'),
    config.get('sgbd.senha'),
    {
        host: config.get('sgbd.host'),
        dialect: config.get('sgbd.tipo')
    }
);

module.exports = instancia;