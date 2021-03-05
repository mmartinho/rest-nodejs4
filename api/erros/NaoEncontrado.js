/**
 * Classificação de Erro "Não Encontrado"
 */
class NaoEncontrado extends Error {
    constructor(item) {
        super(item + ' não encontrado');
        this.name = 'NaoEncontrado';
        this.idErro = 0;
    }
}

module.exports = NaoEncontrado;