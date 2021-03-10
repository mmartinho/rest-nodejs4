const ModeloTabelaProduto = require('./ModeloTabelaProduto');
const Produto = require('./Produto');

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
     * @returns Produto
     */
    async pegarPorId(id) {
        const encontrado = await ModeloTabelaProduto.findOne({
            where : {id}
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
     * @param Object dadosParaAtualizar 
     * @returns Produto
     */
    atualizar (id, dadosParaAtualizar) {
        return ModeloTabelaProduto.update(dadosParaAtualizar, {
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
            }
        });
    }
}