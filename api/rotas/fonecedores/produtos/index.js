const Produto = require('./Produto');
const TabelaProduto = require('./TabelaProduto');
const roteador = require('express').Router({mergeParams: true});

/**
 * Rota que responde com a lista de produtos
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método listar() é uma promessa 
 */
roteador.get('/', async (requisicao, resposta, proximo) => {
    const produtos = await TabelaProduto.listar(requisicao.fornecedor.id);
    resposta.send(
        JSON.stringify(produtos)
    )
});

/**
 * Rota que insere um novo produto 
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método listar() é uma promessa  
 */
roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const idFornecedor = requisicao.fornecedor.id;
        const corpo = requisicao.body;
        const dados = Object.assign({}, corpo, {fornecedor:idFornecedor});
        const produto = new Produto(dados);
        await produto.criar();
        resposta.status(201);
        resposta.send(
            JSON.stringify(produto)
        )
    } catch (erro) {
        proximo(erro);
    }
});

roteador.delete('/:id', async (requisicao, resposta) => {
    const dados = {
        id: requisicao.params.id,
        fornecedor: requisicao.fornecedor.id
    }
    const produto = new Produto(dados);
    await produto.apagar();
    resposta.status(204);
    resposta.send(
        JSON.stringify(produto)
    );
});

module.exports = roteador;