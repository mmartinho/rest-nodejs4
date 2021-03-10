/**
 * Lista de todos os modelos de tabelas
 */
const modelos = [
    require('../rotas/fonecedores/ModeloTabelaFornecedor'),
    require('../rotas/fonecedores/produtos/ModeloTabelaProduto')
];

/**
 * Sincroniza a criação das tabelas
 */
async function criarTabelas() {
    for(let i = 0; i < modelos.length; i++) {
        const modelo = modelos[i];
        await modelo.sync()    
            .then( () => { 
                console.log('Tabela criada com sucesso');
            })
            .catch( (motivo) => { 
                console.log(motivo); 
            });
    }
}

criarTabelas();

