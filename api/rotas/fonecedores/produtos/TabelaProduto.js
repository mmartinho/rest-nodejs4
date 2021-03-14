const ModeloTabelaProduto = require('./ModeloTabelaProduto');
const NaoEncontrado = require('../../../erros/NaoEncontrado');
const instancia = require('../../../banco-de-dados');

module.exports = {
    /**
     * Retorna todos os produtos de um fornecedor
     * @param idFornecedor int
     * @returns Produto[]
     */
     listar(idFornecedor) {
        return ModeloTabelaProduto.findAll({
            where: {
                fornecedor: idFornecedor
            },
            raw:true
        });
    },
    /**
     * Retorna um fornecedor criado no DB
     * @param dados Produto
     * @returns Produto 
     */
    inserir(dados) {
        return ModeloTabelaProduto.create(dados);
    },
    /**
     * Retorna um produto a partir de seu id
     * @param int id 
     * @param int fornecedor
     * @returns Produto
     */
    async pegarPorId(id, fornecedor) {
        const encontrado = await ModeloTabelaProduto.findOne({
            where : {id, fornecedor},
            raw : true
        });
        if(!encontrado) {
            throw new NaoEncontrado(`Produto de id ${id}`);
        } 
        return encontrado;
    },
    /**
     * Retorna o produto a partir de seu id com 
     * os dados atualizados
     * @param int id 
     * @param Object dados 
     * @returns Produto
     */
    atualizar (id, dados) {
        return ModeloTabelaProduto.update(dados, {
            where : {id}
        });
    },
    /**
     * Retorna o produto com id/fornecedor que foi excluído 
     * @param int idProduto 
     * @param int idFornecedor
     * @returns Produto
     */
    remover(idProduto, idFornecedor) {
        return ModeloTabelaProduto.destroy({
            where: {
                id : idProduto, 
                fornecedor : idFornecedor
            },
            raw: true
        });
    },
    /**
     * @param {*} idProduto 
     * @param {*} idFornecedor 
     * @param {*} campo 
     * @param {*} quantidade 
     */
    subtrair(idProduto, idFornecedor, campo, quantidade) {
        return instancia.transaction(async transacao => {
            const produto = await ModeloTabelaProduto.findOne({
                id : idProduto,
                fornecedor: idFornecedor
            });
            produto[campo]= quantidade;
            await produto.save();
            return produto;            
        });
    },
    /**
     * Lista produtos com determinados critérios
     * @param {*} idFornecedor 
     * @param {*} criterios 
     * @returns 
     */
    listar (idFornecedor, criterios = {}) {
        criterios.fornecedor = idFornecedor;
        return ModeloTabelaProduto.findAll({
            where: criterios,
            raw: true
        });
    }     
}