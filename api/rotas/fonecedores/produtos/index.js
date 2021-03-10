const TabelaProduto = require('./TabelaProduto');
const roteador = require('express').Router({mergeParams: true});

/**
 * Rota que responde com a lista de produtos
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método listar() é uma promessa 
 */
roteador.get('/', async (requisicao, resposta, proximo) => {
    const produtos = await TabelaProduto.listar(requisicao.params.idFornecedor);
    resposta.send(
        JSON.stringify(produtos)
    )
});

module.exports = roteador;