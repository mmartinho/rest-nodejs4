const ModeloTabelaProduto = require('./ModeloTabelaProduto');

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
     * @param idFornecedor int
     * @param produto Produto
     * @returns Produto 
     */
    inserir(idFornecedor, produto) {
        const novoProduto = Object.assign({fornecedor:idFornecedor}, produto);
        return ModeloTabelaProduto.create(novoProduto);
    },
    /**
     * Retorna um fornecedor a partir de seu id
     * @param int id 
     * @returns Fornecedor
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
     * Retorna o fornecedor a partir de seu id com 
     * os dados atualizados
     * @param int id 
     * @param Object dadosParaAtualizar 
     * @returns Fornecedor
     */
    atualizar (id, dadosParaAtualizar) {
        return ModeloTabelaProduto.update(dadosParaAtualizar, {
            where : {id}
        });
    },
    /**
     * Retorna o fornecedor com id que foi excluído 
     * @param int id 
     * @returns Fornecedor
     */
    remover(id) {
        return ModeloTabelaProduto.destroy({
            where: {id}
        });
    }
}