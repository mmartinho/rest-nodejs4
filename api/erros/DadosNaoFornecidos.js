/**
 * Classificação de Error "Dados Não Fornecidos"
 */
class DadosNaoFornecidos extends Error {
    constructor(item) {
        const mensagem = `Dados de ${item} não foram fornecidos`;
        super(mensagem);
        this.name = 'DadosNaoFornecidos';
        this.idErro = 2;
    }
}

module.exports = DadosNaoFornecidos;