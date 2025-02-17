//const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';
const API_URL = '/api'; // Use sempre o caminho relativo

// Função para obter o ID da atleta da URL
function getAtletaId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Função para buscar os dados da atleta da API
async function buscarAtleta(id) {
    try {
        const response = await fetch(`${API_URL}/atletas/${id}`);
        if (!response.ok) throw new Error('Atleta não encontrada.');
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar atleta:", error);
        return null;
    }
}

// Função para formatar a data de nascimento
function formatarData(data) {
    return data ? data.split('T')[0] : 'Não informada';
}

// Função para exibir os dados da atleta na página
function exibirAtleta(atleta) {
    const atletaInfo = document.getElementById('atleta-info');
    if (!atleta) {
        atletaInfo.innerHTML = '<p>Atleta não encontrada.</p>';
        return;
    }

    atletaInfo.innerHTML = `
        <h3>${atleta.nome_completo}</h3>
        <p>Modalidade: ${atleta.modalidade_nome || 'Não informada'}</p>
        <p>Data de Nascimento: ${formatarData(atleta.data_nascimento)}</p>
        <p>Principais Conquistas: ${atleta.principais_conquistas || 'Não informadas'}</p>
        <p>Fonte da Informação: ${atleta.fonte_informacao || 'Não disponível'}</p>
        <p>Outras Informações: ${atleta.outras_informacoes || 'Não disponíveis'}</p>
    `;
}

// Função para inicializar a página
async function init() {
    const atletaId = getAtletaId();
    if (atletaId) {
        const atleta = await buscarAtleta(atletaId);
        exibirAtleta(atleta);
    } else {
        document.getElementById('atleta-info').innerHTML = '<p>Atleta não encontrada.</p>';
    }
}

document.addEventListener('DOMContentLoaded', init);