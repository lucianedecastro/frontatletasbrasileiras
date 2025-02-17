const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';

// Função para obter o ID da atleta da URL
function getAtletaId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Função para buscar os dados da atleta da API
async function buscarAtleta(id) {
    const response = await fetch(`${API_URL}/atletas/${id}`);
    const atleta = await response.json();
    return atleta;
}

// Função para formatar a data de nascimento
function formatarData(data) {
    if (!data) return ''; // Retorna vazio se a data for nula ou undefined
    return data.split('T')[0]; // Divide a string na letra 'T' e retorna a primeira parte
}

// Função para exibir os dados da atleta na página
function exibirAtleta(atleta) {
    const atletaInfo = document.getElementById('atleta-info');
    atletaInfo.innerHTML = `
        <h3>${atleta.nome_completo}</h3>
        <p>Modalidade: ${atleta.modalidade_nome}</p>
        <p>Data de Nascimento: ${formatarData(atleta.data_nascimento)}</p>
        <p>Principais Conquistas: ${atleta.principais_conquistas}</p>
        <p>Fonte da Informação: ${atleta.fonte_informacao}</p>
        <p>Outras Informações: ${atleta.outras_informacoes}</p>
    `;
}

// Função para inicializar a página
async function init() {
    const atletaId = getAtletaId();
    if (atletaId) {
        const atleta = await buscarAtleta(atletaId);
        exibirAtleta(atleta);
    } else {
        const atletaInfo = document.getElementById('atleta-info');
        atletaInfo.innerHTML = '<p>Atleta não encontrada.</p>';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', init);