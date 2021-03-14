const CampoInvalido = require('../../erros/CampoInvalido');
const DadosNaoFornecidos = require('../../erros/DadosNaoFornecidos');
const Produto = require('./produtos/Produto');
const TabelaProduto = require('./produtos/TabelaProduto');
const TabelaFornecedor = require('./TabelaFornecedor');

/**
 * Representação OM do Fornecedor
 */
class Fornecedor {
    /**
     * Controi o objeto fornecedor
     * 
     * @param Object param 
     */
    constructor({ id, empresa, email, categoria, dataCriacao, dataAtualizacao, versao }) {
        this.id = id;
        this.empresa = empresa; 
        this.email = email; 
        this.categoria = categoria;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.versao = versao;
    }

    /**
     * Cria o novo fornecedor, inserindo-o no BD, e completando 
     * os seus campos de controle
     * 
     * @async / @await Para facilitar a leitura do código, 
     * pois o método TabelaFornecedor.inserir() é uma promessa 
     */
    async criar() {
        this.validar();
        const fornecedor = { 
            empresa : this.empresa, 
            email : this.email, 
            categoria : this.categoria
        };        
        /**
         * Espera chegar os dados do resultado
         */
        const resultado = await TabelaFornecedor.inserir(fornecedor);
        /**
         * Completa os campos de controle com o resultado
         */
        this.id = resultado.id;
        this.dataCriacao = resultado.dataCriacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao;
    }

    /**
     * Carrega os dados do fornecedor a partir da tabela
     */
    async carregar() {
        /**
         * Esperar pegar os dados da tabela fornecedor
         */
        const resultado = await TabelaFornecedor.pegarPorId(this.id);       
        /**
         * Hidrata as propriedades do objeto fornecedor
         */
        this.empresa = resultado.empresa;
        this.email = resultado.email;
        this.categoria = resultado.categoria;
        this.dataCriacao = resultado.dataCriacao;
        this.dataAtualizacao = resultado.dataAtualizacao;
        this.versao = resultado.versao;
    }

    /**
     * Envia dados novos para um fornecedor em particular
     * @returns void
     * @throws Error
     */
    async atualizar() {
        /** 
         * Espera o banco de dados achar o fornecedor 
         * com o id específico 
         */
        await TabelaFornecedor.pegarPorId(this.id);
        /** Propriedades passíveis de serem modificadas */
        const campos = ['empresa', 'email', 'categoria'];
        /** Dados para atualizar inicialmente vazios */
        const dadosParaAtualizar = {}
        /** Para cada campo */
        campos.forEach((campo) => {
            const valor = this[campo];
            if(typeof valor === 'string' && valor.length > 0) {
                dadosParaAtualizar[campo] = valor;
            }
        });
        /** Se não existem dados para atualizar */
        if(Object.keys(dadosParaAtualizar).length === 0) {
            throw new DadosNaoFornecidos('Fornecedor');
        }
        /** Espera o fornecedor de id específico atualizar os dados */
        await TabelaFornecedor.atualizar(this.id, dadosParaAtualizar);
    }

    /**
     * Remove o fornecedor de id específico
     */
    remover() {
        return TabelaFornecedor.remover(this.id);
    }

    /**
     * 
     */
    validar() {
        const campos = ['empresa', 'email', 'categoria'];
        campos.forEach(campo => {
            const valor = this[campo];
            if(typeof valor !== 'string' || valor.length === 0) {
                throw new CampoInvalido('Fornecedor', campo);
            }
        });
    }
};

module.exports = Fornecedor;