// Variáveis Globais
const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';

const atletasLista = document.getElementById('atletas-lista');
const modalidadeSelect = document.getElementById('modalidade');
const paginacaoContainer = document.getElementById('paginacao');

let atletas = [];
let modalidades = [];
let paginaAtual = 1;
let atletasPorPagina = 30;
let totalAtletas = 0; // Armazena o número total de atletas

// Funções para buscar dados da API
async function buscarAtletas(pagina = 1, modalidade = '') {
    let url = `${API_URL}/atletas?page=${pagina}&limit=${atletasPorPagina}`;
    if (modalidade) {
        url += `&modalidade_id=${modalidade}`;
    }

    try {
        console.log("Buscando atletas em:", url);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar atletas: ${response.status} - ${response.statusText}`);
        }

        const atletas = await response.json();
        console.log("Atletas recebidos:", atletas);
        return atletas;
    } catch (error) {
        console.error("Erro na requisição buscarAtletas:", error);
        return [];
    }
}

async function buscarModalidades() {
    try {
        console.log("Buscando modalidades em:", `${API_URL}/modalidades`);
        const response = await fetch(`${API_URL}/modalidades`);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
        }

        const modalidades = await response.json();
        console.log("Modalidades recebidas:", modalidades);
        return modalidades;
    } catch (error) {
        console.error("Erro na requisição buscarModalidades:", error);
        return [];
    }
}

// Nova função para buscar o número total de atletas
async function buscarTotalAtletas(modalidade = '') {
    let url = `${API_URL}/atletas/count`;
    if (modalidade) {
        url += `?modalidade_id=${modalidade}`;
    }

    try {
        console.log("Buscando total de atletas em:", url);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar total de atletas: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        totalAtletas = data.total; // Atualiza a variável global
        return totalAtletas;
    } catch (error) {
        console.error("Erro na requisição buscarTotalAtletas:", error);
        return 0;
    }
}

// Funções para exibir os dados no HTML
function exibirAtletas(atletas) {
    atletasLista.innerHTML = ''; // Limpa a lista

    atletas.forEach(atleta => {
        const atletaCard = document.createElement('div');
        atletaCard.classList.add('atleta-card');

        const nomeElement = document.createElement('h3');
        nomeElement.textContent = atleta.nome_completo;

        const modalidadeElement = document.createElement('p');
        modalidadeElement.textContent = `Modalidade: ${atleta.modalidade_nome}`;

        const linkElement = document.createElement('a');
        linkElement.href = `atleta.html?id=${atleta.id}`;
        linkElement.textContent = 'Ver Detalhes';

        atletaCard.appendChild(nomeElement);
        atletaCard.appendChild(modalidadeElement);
        atletaCard.appendChild(linkElement);

        atletasLista.appendChild(atletaCard);
    });
}

function exibirModalidades(modalidades) {
    modalidadeSelect.innerHTML = '<option value="">Todas</option>'; // Limpa o select

    modalidades.forEach(modalidade => {
        const option = document.createElement('option');
        option.value = modalidade.id;
        option.textContent = modalidade.nome;
        modalidadeSelect.appendChild(option);
    });
}

function exibirPaginacao() {
    const totalPaginas = Math.ceil(totalAtletas / atletasPorPagina);
    paginacaoContainer.innerHTML = ''; // Limpa a paginação

    for (let i = 1; i <= totalPaginas; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            paginaAtual = i;
            carregarAtletas(); // Carrega as atletas da nova página
        });
        paginacaoContainer.appendChild(button);
    }
}

// Funções para carregar os dados e atualizar a página
async function carregarAtletas() {
    const atletas = await buscarAtletas(paginaAtual, modalidadeSelect.value);
    exibirAtletas(atletas);
}

async function carregarModalidades() {
    const modalidades = await buscarModalidades();
    exibirModalidades(modalidades);
}

// Função para inicializar a página
async function init() {
    await carregarModalidades();
    await carregarTotalAtletas(); // Carrega o número total de atletas
    await carregarAtletas(); // Carrega as atletas da primeira página
    exibirPaginacao(); // Exibe a paginação
}

// Nova função para carregar o número total de atletas
async function carregarTotalAtletas() {
    await buscarTotalAtletas(modalidadeSelect.value);
}

// Event Listeners
modalidadeSelect.addEventListener('change', () => {
    paginaAtual = 1; // Reseta para a primeira página ao mudar a modalidade
    carregarTotalAtletas(); // Recarrega o número total de atletas
    carregarAtletas(); // Carrega as atletas da nova página
    exibirPaginacao(); // Exibe a paginação
});

// Inicialização
document.addEventListener('DOMContentLoaded', init);
