const ModeloTabelaFornecedor = require('../rotas/fonecedores/ModeloTabelaFornecedor');

/**
 * Realiza da promessa da definição da tabela
 */
ModeloTabelaFornecedor.sync()
    .then( () => { 
        console.log('Tabela fornecedor criada com sucesso');
    })
    .catch( (motivo) => { 
        console.log(motivo); 
    });