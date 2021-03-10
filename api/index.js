const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const roteadorFornecedor = require('./rotas/fonecedores');
const NaoEncontrado = require('./erros/NaoEncontrado');
const CampoInvalido = require('./erros/CampoInvalido');
const ValorNaoSuportado = require('./erros/ValorNaoSuportado');
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos');
const { formatosAceitos, SerializadorErro } = require('./Serializador');

/**
 * Cria a instância do app server
 */
const app = express();

/**
 * Middleware: Injeta o tradutor do formato JSON no app server
 */
app.use(bodyParser.json());

/**
 * Middleware: Antes de acessar qualquer rota, verifica
 * se o formato requisitado é aceito pela API
 */
app.use((requisicao, resposta, proximo) => {
    let formatoRequisitado = requisicao.header('Accept');

    /**
     * É formato geral?
     */
    if(formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json';
    }

    /**
     * Formato requisitado é aceito?
     */
    if(formatosAceitos.indexOf(formatoRequisitado) === -1) {
        resposta.status(406).json(`Formato ${formatoRequisitado} não é aceito`);
    } else {
        resposta.setHeader('Content-Type', formatoRequisitado);
        proximo();
    }
});

/**
 * Middleware: Conjunto de todas as rotas de Fornecedores
 */
app.use('/api/fornecedores', roteadorFornecedor);

/**
 * Middleware: Conjunto de todos os erros da API
 */
app.use((erro, requisicao, resposta, proxima) => {
    const serializador = new SerializadorErro(
        resposta.getHeader('Content-Type')
    );
    let status = 500;
    if(erro instanceof NaoEncontrado) {
        status = 404;
    } else if(erro instanceof CampoInvalido || erro instanceof ValorNaoSuportado) {
        status = 406;
    } else if(erro instanceof DadosNaoFornecidos) { 
        status = 412;        
    } else { /**  todos os outros */
        status = 400;
    }
    resposta.status(status);
    data = serializador.serializar({mensagem: erro.message});
    resposta.send(data);
});

/**
 * Coloca o app server para ouvir na porta TCP 
 * @see config\default.json
 */
app.listen(config.get('api.porta'), () => { 
    console.log('API ouvindo na porta ' + config.get('api.porta')) 
});

module.exports = app;