const Sequelize = require('sequelize');
const instancia = require('../../banco-de-dados/index');

/**
 * Estrutura das colunas da tabela "Fornecedores"
 */
const colunas = {
    empresa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false        
    }, 
    categoria: {
        type: Sequelize.ENUM('ração', 'brinquedos'),
        allowNull: false        
    },     
};

/**
 * Opções de configuração da tabela "Fornecedores"
 * @property freezeTableName Força o nome da tabela
 * @property tableName Nome de tabela 
 * @property timestamps Gerar colunas: "createdAt", "updatedAt" e "version"
 * @property createdAt Troca o nome da coluna "createdAt"
 * @property updatedAt Troca o nome da coluna "updatedAt"
 * @property version Troca o nome da coluna "version"
 */
const opcoes = {
    freezeTableName : true,
    tableName : 'fornecedores',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

/**
 * Promessa de definição da tabela
 */
module.exports = instancia.define('fornecedor', colunas, opcoes);

