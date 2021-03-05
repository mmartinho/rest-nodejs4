/**
 * Classificação de Error "Campo Inválido"
 */
class CampoInvalido extends Error {
    constructor(item, campo) {
        const mensagem = `O campo ${campo} de ${item} está inválido`;
        super(mensagem);
        this.name = 'CampoInvalido';
        this.idErro = 1;
    }
}

module.exports = CampoInvalido;