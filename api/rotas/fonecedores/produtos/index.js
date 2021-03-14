const Produto = require('./Produto');
const TabelaProduto = require('./TabelaProduto');
const roteador = require('express').Router({mergeParams: true});
const { SerializadorProduto } = require('../../../Serializador');

/**
 * Rota OPTIONS para rotas "com parametros"
 */
 roteador.options('/', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'GET,POST');
    resposta.set('Access-Control-Allow-Headers', 'Content-Type');
    resposta.status(204);
    resposta.end();
});

/**
 * Rota que responde com a lista de produtos 
 */
roteador.get('/', async (requisicao, resposta, proximo) => {
    const produtos = await TabelaProduto.listar(requisicao.fornecedor.id);
    const serializador = new SerializadorProduto (
        resposta.getHeader('Content-Type'),
        ['preco','estoque','dataCriacao']
    );    
    resposta.send(
        serializador.serializar(produtos)
    )
});

/**
 * Rota que insere um novo produto  
 */
roteador.post('/', async (requisicao, resposta, proximo) => {
    try{
        const idFornecedor = requisicao.fornecedor.id;
        const corpo = requisicao.body;
        const dados = Object.assign({}, corpo, {fornecedor:idFornecedor});
        const produto = new Produto(dados);
        await produto.criar();
        /** 
         * ETag 
         */
        resposta.set('Etag', produto.versao); 
        /**
         * Last-Modified
         */
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        resposta.set('Last-Modified', timestamp);
        /**
         * Location
         */
        resposta.set(
            'Location', 
            `/api/fornecedores/${produto.fornecedor}/produtos/${produto.id}`
        );        
        resposta.status(201);
        const serializador = new SerializadorProduto(
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'dataCriacao']
        ); 
        resposta.send(
            serializador.serializar(produto)
        )
    } catch (erro) {
        proximo(erro);
    }
});

/**
 * Rota OPTIONS para rotas "com parametros"
 */
 roteador.options('/:id', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'DELETE,GET,HEAD,PUT');
    resposta.set('Access-Control-Allow-Headers', 'Content-Type');
    resposta.status(204);
    resposta.end();
});

/**
 * Rota que exclui um produto 
 */
roteador.delete('/:id', async (requisicao, resposta, proximo) => {
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        }
        const produto = new Produto(dados);
        await produto.carregar();
        await produto.apagar();
        resposta.status(200);
        const serializador = new SerializadorProduto (
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'dataCriacao']
        );
        resposta.send(
            serializador.serializar(produto)
        );
    } catch (erro) {
        proximo(erro);
    }
});

/**
 * Rota que exibe as infos de um produto 
 */
roteador.get('/:id', async(requisicao, resposta, proximo)=>{
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor : requisicao.fornecedor.id
        }
        const produto = new Produto(dados);
        await produto.carregar();
        resposta.status(200);
        /** 
         * ETag 
         */
        resposta.set('Etag', produto.versao); 
        /**
         * Last-Modified
         */
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        resposta.set('Last-Modified', timestamp);        
        const serializador = new SerializadorProduto (
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'dataCriacao']
        );        
        resposta.send(
            serializador.serializar(produto)
        );
    } catch (erro) {
        proximo(erro);
    }
});

/**
 * Rota que pega somente os metadados de um produto
 */
roteador.head('/id:', async (requisicao, resposta, proximo) => {
    try {
        const dados = {
            id: requisicao.params.id,
            fornecedor : requisicao.fornecedor.id
        }
        const produto = new Produto(dados);
        await produto.carregar();
        resposta.status(200);
        /** 
         * ETag 
         */
        resposta.set('Etag', produto.versao); 
        /**
         * Last-Modified
         */
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        resposta.set('Last-Modified', timestamp);        
        resposta.end();      
    } catch (erro) {
        proximo(erro);
    }
});

/**
 * Rota que atualiza as infos de um produto 
 */
roteador.put('/:id', async (requisicao, resposta, proximo) => {
    try {
        const id = requisicao.params.id;
        const produto = new Produto(
            Object.assign({}, requisicao.body, {id: id, fornecedor: requisicao.fornecedor.id})
        );
        /**
         * Atualiza o produto
         */
        await produto.atualizar();         
        resposta.status(200);
        const serializador = new SerializadorProduto(
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'dataCriacao']
        );
        /**
         * Recarrega as propriedades do produto
         */
        await produto.carregar();
        /** 
         * ETag 
         */
        resposta.set('Etag', produto.versao); 
        /**
         * Last-Modified
         */
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        resposta.set('Last-Modified', timestamp);         
        resposta.send(serializador.serializar(produto));        
    } catch (erro) {
        proximo(erro);
    }    
});

/**
 * Rota OPTIONS para rotas "com parametros e controller"
 */
 roteador.options('/:id', (requisicao, resposta) => {
    resposta.set('Access-Control-Allow-Methods', 'POST');
    resposta.set('Access-Control-Allow-Headers', 'Content-Type');
    resposta.status(204);
    resposta.end();
});

/**
 * Rota que diminui o estoque de um produto
 */
roteador.post('/:id/diminuir-estoque', async (requisicao, resposta, proximo) => {
    try {
        const produto = new Produto({ 
            id : requisicao.params.id,
            fornecedor: requisicao.fornecedor.id
        });
        await produto.carregar();
        /**
         * Subtrai o estoque
         */
        produto.estoque = produto.estoque - requisicao.body.quantidade;
        await produto.diminuirEstoque();
        /**
         * Recarrega as propriedades do produto
         */
        await produto.carregar();
        /** 
         * ETag 
         */
        resposta.set('Etag', produto.versao); 
        /**
         * Last-Modified
         */
        const timestamp = (new Date(produto.dataAtualizacao)).getTime();
        resposta.set('Last-Modified', timestamp);        
        resposta.status(200);
        const serializador = new SerializadorProduto(
            resposta.getHeader('Content-Type'),
            ['preco','estoque', 'dataCriacao']
        );        
        resposta.send(serializador.serializar(produto));
    } catch (erro) {
        proximo(erro);
    }  
});

module.exports = roteador;