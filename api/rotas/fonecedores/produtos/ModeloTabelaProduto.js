const Sequelize = require('sequelize');
const instancia = require('../../../banco-de-dados/index');

/**
 * Estrutura das colunas da tabela "Fornecedores"
 */
const colunas = {
    titulo: {
        type: Sequelize.STRING,
        allowNull: false
    },
    preco: {
        type: Sequelize.DOUBLE,
        allowNull: false        
    }, 
    estoque: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0        
    },
    /**
     * Chave estrangeira do fornecedor
     */
    fornecedor : {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
            model : require('../ModeloTabelaFornecedor'),
            key: 'id'
        }  
    }     
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
    tableName : 'produtos',
    timestamps: true,
    createdAt: 'dataCriacao',
    updatedAt: 'dataAtualizacao',
    version: 'versao'
}

module.exports = instancia.define('produto', colunas, opcoes);