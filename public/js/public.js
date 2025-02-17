const API_URL = window.location.hostname === 'localhost' 
    ? `${window.location.protocol}//${window.location.hostname}:3000`
    : 'https://api.atletasbrasileiras.com.br';

const atletasLista = document.getElementById('atletas-lista');
const modalidadeSelect = document.getElementById('modalidade');
const paginacaoContainer = document.getElementById('paginacao');

let paginaAtual = 1;
let atletasPorPagina = 30;
let totalAtletas = 0;

async function buscarAtletas(pagina = 1, modalidade = '') {
    let url = `${API_URL}/api/atletas?page=${pagina}&limit=${atletasPorPagina}`;
    if (modalidade) url += `&modalidade_id=${modalidade}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar atletas: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Erro na requisição buscarAtletas:", error);
        return [];
    }
}

async function buscarModalidades() {
    try {
        const response = await fetch(`${API_URL}/api/modalidades`);
        if (!response.ok) throw new Error(`Erro ao buscar modalidades: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Erro na requisição buscarModalidades:", error);
        return [];
    }
}

async function buscarTotalAtletas(modalidade = '') {
    let url = `${API_URL}/api/atletas/count`;
    if (modalidade) url += `?modalidade_id=${modalidade}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Erro ao buscar total de atletas: ${response.statusText}`);
        const data = await response.json();
        totalAtletas = data.total;
        return totalAtletas;
    } catch (error) {
        console.error("Erro na requisição buscarTotalAtletas:", error);
        return 0;
    }
}

function exibirAtletas(atletas) {
    atletasLista.innerHTML = '';
    atletas.forEach(atleta => {
        const atletaCard = document.createElement('div');
        atletaCard.classList.add('atleta-card');
        atletaCard.innerHTML = `
            <h3>${atleta.nome_completo}</h3>
            <p>Modalidade: ${atleta.modalidade_nome || 'Não informada'}</p>
            <a href="atleta.html?id=${atleta.id}">Ver Detalhes</a>
        `;
        atletasLista.appendChild(atletaCard);
    });
}

function exibirModalidades(modalidades) {
    modalidadeSelect.innerHTML = '<option value="">Todas</option>';
    modalidades.forEach(modalidade => {
        const option = document.createElement('option');
        option.value = modalidade.id;
        option.textContent = modalidade.nome;
        modalidadeSelect.appendChild(option);
    });
}

function exibirPaginacao() {
    const totalPaginas = Math.ceil(totalAtletas / atletasPorPagina);
    paginacaoContainer.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            paginaAtual = i;
            carregarAtletas();
        });
        paginacaoContainer.appendChild(button);
    }
}

async function carregarAtletas() {
    const atletas = await buscarAtletas(paginaAtual, modalidadeSelect.value);
    exibirAtletas(atletas);
}

async function carregarModalidades() {
    const modalidades = await buscarModalidades();
    exibirModalidades(modalidades);
}

async function carregarTotalAtletas() {
    await buscarTotalAtletas(modalidadeSelect.value);
}

document.addEventListener('DOMContentLoaded', async () => {
    await carregarModalidades();
    await carregarTotalAtletas();
    await carregarAtletas();
    exibirPaginacao();
});

modalidadeSelect.addEventListener('change', async () => {
    paginaAtual = 1;
    await carregarTotalAtletas();
    await carregarAtletas();
    exibirPaginacao();
});
