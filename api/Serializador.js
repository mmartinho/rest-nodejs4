const ValorNaoSuportado = require('./erros/ValorNaoSuportado');
const jsontoxml = require('jsontoxml');

/**
 * Classe genérica que trata conteúdos de resposta
 * @see SerializadorFornecedor
 * @see SerializadorErro
 */
class Serializador {
    /**
     * Retorna os objetos / arrays em formato JSON
     * @param {*} dados 
     */
    json(dados) {
        return JSON.stringify(dados);
    }

    /**
     * Retorna os objetos / arrays em formato XML.
     * OBS: Precisa de uma tag singular / plural para 
     * difenciar se é um array de objetos ou apenas um objeto
     * @param {*} dados 
     */
    xml(dados) {
        let tag = this.tagSingular;
        if(Array.isArray(dados)) {
            tag = this.tagPlural;
            /** Reformata a saída dos dados */
            dados = dados.map((item) => { 
                return {
                    [this.tagSingular] : item
                } 
            });
        }
        return jsontoxml({[tag] : dados});
    }

    /**
     * Decide como formatar os dados a partir 
     * do contentType
     * @param {*} dados 
     */
    serializar(dados) {
        dados = this.filtrar(dados);
        if(this.contentType === 'application/json') {
            return this.json(dados);
        }
        if(this.contentType === 'application/xml') {
            return this.xml(dados);
        }
        if(this.contentType === '*/*') {
            return dados;
        }
        throw new ValorNaoSuportado(this.contentType);
    }

    /**
     * Recria o objeto apenas com suas propriedades públicas 
     * @param Object dados
     * @returns Object 
     */
    filtrarObjeto(dados) {
        const novoObjeto = {};
        this.camposPublicos.forEach((campo) => {
            if(dados.hasOwnProperty(campo)) {
                novoObjeto[campo] = dados[campo];
            }
        });
        return novoObjeto;
    }

    /**
     * Recria a lista ou o objeto apenas com suas propriedades públicas
     * @param {*} dados 
     * @returns []Object | Object
     */
    filtrar(dados) {
        let novosDados = [];
        if(Array.isArray(dados)) {
            /**
             * Remapeia os dados com o callback do filtro de objeto
             */
            novosDados = dados.map((item) => { return this.filtrarObjeto(item); });
        } else {
            novosDados = this.filtrarObjeto(dados);
        }
        return novosDados;
    }
}

/**
 * Trata o conteúdo de resposta de erros serializados
 */
class SerializadorErro extends Serializador {
    constructor(contentType, camposExtras) {
        super();
        this.contentType = contentType
        this.camposPublicos = [ 'mensagem' ].concat(camposExtras || []);
        this.tagSingular = 'erro';
        this.tagPlural = 'erros';
    }
}

/**
 * Trata o conteúdo de resposta da classe fornecedor
 */
class SerializadorFornecedor extends Serializador {
    /**
     * @param string contentType 
     */
    constructor(contentType, camposExtras) {
        super();
        this.contentType = contentType;
        this.camposPublicos = ['id','empresa','categoria'].concat(camposExtras || []);
        this.tagSingular = 'fornecedor';
        this.tagPlural = 'fornecedores';
    }
}

/**
 * Trata o conteúdo de resposta da classe fornecedor
 */
 class SerializadorFornecedorV2 extends SerializadorFornecedor {
    /**
     * @param string contentType 
     */
    constructor(contentType, camposExtras) {
        super(contentType, camposExtras);
        this.camposPublicos = ['id','categoria'].concat(camposExtras || []);
    }
}

/**
 * Trata o conteúdo de resposta da classe fornecedor
 */
 class SerializadorProduto extends Serializador {
    /**
     * @param string contentType 
     */
    constructor(contentType, camposExtras) {
        super();
        this.contentType = contentType;
        this.camposPublicos = ['id', 'titulo'].concat(camposExtras || []);
        this.tagSingular = 'produto';
        this.tagPlural = 'produtos';
    }
}

module.exports = { 
    Serializador : Serializador,
    SerializadorFornecedor : SerializadorFornecedor,
    SerializadorFornecedorV2 : SerializadorFornecedorV2,
    SerializadorErro : SerializadorErro,
    SerializadorProduto : SerializadorProduto,
    formatosAceitos: ['application/json', 'application/xml', '*/*']
};