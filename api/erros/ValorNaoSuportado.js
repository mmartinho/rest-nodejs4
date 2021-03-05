/**
 * Classificação de Error "Valor Não Suportado Não Fornecidos"
 */
class ValorNaoSuportado extends Error {
    constructor(tipoConteudo) {
        const mensagem = `Tipo de conteúdo ${tipoConteudo} não é suportado`;
        super(mensagem);
        this.name = 'ValorNaoSuportado';
        this.idErro = 2;
    }
}

module.exports = ValorNaoSuportado;