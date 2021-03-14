const TabelaProduto = require('./TabelaProduto');
const DadosNaoFornecidos = require('../../../erros/DadosNaoFornecidos');
const CampoInvalido = require('../../../erros/CampoInvalido');

class Produto {
    /**
     * @param {*} param0 
     */
    constructor({id, titulo, preco, estoque, fornecedor, dataCriacao, dataAtualizacao, versao}) {
        this.id = id;
        this.titulo = titulo;
        this.preco = preco;
        this.estoque = estoque;
        this.fornecedor = fornecedor;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
        this.dadosParaAtualizar = {};
    }

    /**
     * Valida propriedades
     */
    validar(disparaErro=true) {
        if(typeof this.titulo === 'string' && this.titulo.length > 0) {
            this.dadosParaAtualizar.titulo = this.titulo;
        } else if (disparaErro) {
            throw new CampoInvalido('Produto', 'Título');
        }

        if(typeof this.preco === 'number' && this.preco > 0) {
           this.dadosParaAtualizar.preco = this.preco; 
        } else if(disparaErro) {
            throw new CampoInvalido('Produto', 'Preço');;
        }

        if(typeof this.estoque === 'number') {
            this.dadosParaAtualizar.estoque = this.estoque; 
         } else if(disparaErro) {
            throw new CampoInvalido('Produto', 'Estoque');;
         }
    }

    /**
     * Cria novo produto no BD, completando as propriedades 
     * da instancia
     */
    async criar() {
        this.validar(true);
        const resultado = await TabelaProduto.inserir({
            titulo : this.titulo,
            preco: this.preco,
            estoque : this.estoque,
            fornecedor : this.fornecedor
        });
        this.id = resultado.id;
        this.dataCriacao = resultado.dataCriacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao
    }

    /**
     * Apaga o produto do fornecedor
     */
    async apagar() {
        TabelaProduto.remover(this.id, this.fornecedor);
    }

    /**
     * Carrega para a instancia o produto do fornecedor
     */
    async carregar() {      
        const produto = await TabelaProduto.pegarPorId(this.id, this.fornecedor);
        this.titulo = produto.titulo;
        this.preco = produto.preco;
        this.estoque = produto.estoque;
        this.dataCriacao = produto.dataCriacao;
        this.dataAtualizacao = produto.dataAtualizacao;
        this.versao = produto.versao;
    }

    /**
     * Envia dados novos para um fornecedor em particular
     * @returns void
     * @throws Error
     */
     async atualizar() {   
        this.validar(false);
 
        /** Se não existem dados para atualizar */
        if(Object.keys(this.dadosParaAtualizar).length === 0) {
            throw new DadosNaoFornecidos('Produto');
        }
        /** 
         * Espera o banco de dados achar o produto 
         * com o id específico 
         */
        await TabelaProduto.pegarPorId(this.id, this.fornecedor);
        /** Espera o produto de id específico atualizar os dados */
        await TabelaProduto.atualizar(this.id, this.dadosParaAtualizar);
    } 
    
    /**
     * @returns 
     */
    async diminuirEstoque() {
        return TabelaProduto.subtrair(this.id, this.fornecedor, 'estoque', this.estoque);
    }   
}

module.exports = Produto;