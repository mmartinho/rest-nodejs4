const ModeloTabelaFornecedor = require('./ModeloTabelaFornecedor');
const NaoEncontrado = require('../../erros/NaoEncontrado');

/**
 * Módulo "tradutor" do ModeloTabelaFornecedor
 * @see api\rotas\fonecedores\ModeloTabelaFornecedor.js
 */
module.exports = {
    /**
     * Retorna todos os fornecedores
     * @returns Fornecedor[]
     */
    listar() {
        return ModeloTabelaFornecedor.findAll({raw:true});
    },
    /**
     * Retorna um fornecedor criado no DB
     * @param Fornecedor
     * @returns Fornecedor 
     */
    inserir(fornecedor) {
        return ModeloTabelaFornecedor.create(fornecedor);;
    },
    /**
     * Retorna um fornecedor a partir de seu id
     * @param int id 
     * @returns Fornecedor
     */
    async pegarPorId(id) {
        const encontrado = await ModeloTabelaFornecedor.findOne({
            where : {id}
        });
        if(!encontrado) {
            throw new NaoEncontrado(`Fornecedor de id ${id}`);
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
        return ModeloTabelaFornecedor.update(dadosParaAtualizar, {
            where : {id}
        });
    },
    /**
     * Retorna o fornecedor com id que foi excluído 
     * @param int id 
     * @returns Fornecedor
     */
    remover(id) {
        return ModeloTabelaFornecedor.destroy({
            where: {id}
        });
    }
}