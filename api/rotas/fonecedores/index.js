const roteador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const { SerializadorFornecedor } = require('../../Serializador');

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
    const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
    resposta.send(serializador.serializar(resultados));
});

/**
 * Rota que cria um novo "fornecedor" a partir dos dados 
 * envidados na requisicao
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método criar() é uma promessa  
 */
roteador.post('/', async (requsicao, resposta, proxima) => {
    try {
        const fornecedor = new Fornecedor(requsicao.body);
        await fornecedor.criar();
        resposta.status(201);
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
        resposta.send(serializador.serializar(fornecedor));
    } catch (erro) {
        proxima(erro);
    }
});

/**
 * Rota que responde com os dados do fornecedor 
 * com id específico
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método carregar() é uma promessa 
 */
roteador.get('/:id', async (requisicao, resposta, proxima) => {
    try {
        const id = requisicao.params.id;
        const fornecedor = new Fornecedor({id});
        await fornecedor.carregar();
        resposta.status(200);
        const serializador = new SerializadorFornecedor(
            resposta.getHeader('Content-Type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        );
        resposta.send(serializador.serializar(fornecedor));        
    } catch (erro) {
        proxima(erro);
    }
});

/**
 * Rota que responde com os dados do fornecedor 
 * com id específico
 * 
 * @async / @await Para facilitar a leitura do código, 
 * pois o método carregar() é uma promessa 
 */
roteador.put('/:id', async (requisicao, resposta, proxima) => {
    try {
        const id = requisicao.params.id;
        const fornecedor = new Fornecedor(Object.assign({}, requisicao.body, {id}));
        await fornecedor.atualizar();
        resposta.status(200);
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
        resposta.send(serializador.serializar(fornecedor));        
    } catch (erro) {
        proxima(erro);
    }
});

/**
 * Rota que remove um fornecedor com id específico
 */
roteador.delete('/:id', async (requisicao, resposta, proxima) => {
    try {
        const id = requisicao.params.id;
        const fornecedor = new Fornecedor({id});
        await fornecedor.carregar();
        await fornecedor.remover();
        resposta.status(200);
        const serializador = new SerializadorFornecedor(resposta.getHeader('Content-Type'));
        resposta.send(serializador.serializar({  
            mensagem: `Fornecedor de id ${id} removido`, 
            fornecedor
        }));
    } catch (erro) {
        proxima(erro);
    }
});

module.exports = roteador;