const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const { SerializadorFornecedorV2 } = require('../../Serializador');

/**
 * Rota OPTIONS para rotas "sem parametro"
 */
roteador.options('/', (requisicao, resposta, proximo) => {
    resposta.set('Access-Control-Allow-Methods', 'GET');
    resposta.set('Access-Control-Allow-Headers', 'Content-Type');
    resposta.status(204);
    resposta.end();
});

/**
 * Rota que responde com a lista de fornecedores
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método listar() é uma promessa 
 */
roteador.get('/', async (requsicao, resposta) => {
    /**
     * Await: Espera a lista chegar por inteiro
     */
    const resultados = await TabelaFornecedor.listar();
    resposta.status(200);
    const serializador = new SerializadorFornecedorV2(resposta.getHeader('Content-Type'));
    resposta.send(serializador.serializar(resultados));
});

module.exports = roteador;