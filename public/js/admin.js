const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';

const tabelaAtletas = document.getElementById('tabela-atletas');
const formularioEdicao = document.getElementById('formulario-edicao');
const editarAtletaForm = document.getElementById('editar-atleta-form');
const cancelarEdicao = document.getElementById('cancelar-edicao');
const adicionarAtletaButton = document.getElementById('adicionarAtleta');
let atletaEmEdicao = null;

async function preencherFormularioEdicao(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/atletas/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Não foi possível buscar a atleta');
        
        const atleta = await response.json();

        document.getElementById('nome_completo').value = atleta.nome_completo || '';
        document.getElementById('data_nascimento').value = atleta.data_nascimento ? atleta.data_nascimento.split('T')[0] : '';
        document.getElementById('modalidade_id').value = atleta.modalidade_id || '';
        document.getElementById('principais_conquistas').value = atleta.principais_conquistas || '';
        document.getElementById('fonte_informacao').value = atleta.fonte_informacao || '';
        document.getElementById('outras_informacoes').value = atleta.outras_informacoes || '';

        atletaEmEdicao = id;
        formularioEdicao.style.display = 'block';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao preencher o formulário de edição');
    }
}

tabelaAtletas.addEventListener('click', async (event) => {
    const botao = event.target;
    const id = botao.dataset.id;

    if (botao.classList.contains('editar')) preencherFormularioEdicao(id);

    if (botao.classList.contains('excluir')) {
        if (confirm('Tem certeza que deseja excluir esta atleta?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/atletas/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Não foi possível excluir a atleta');
                alert('Atleta excluída com sucesso!');
                buscarAtletas();
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao excluir a atleta');
            }
        }
    }
});

editarAtletaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dadosAtleta = {
        nome_completo: document.getElementById('nome_completo').value,
        data_nascimento: document.getElementById('data_nascimento').value,
        modalidade_id: document.getElementById('modalidade_id').value,
        principais_conquistas: document.getElementById('principais_conquistas').value,
        fonte_informacao: document.getElementById('fonte_informacao').value,
        outras_informacoes: document.getElementById('outras_informacoes').value
    };

    try {
        const token = localStorage.getItem('token');
        const method = atletaEmEdicao ? 'PUT' : 'POST';
        const url = atletaEmEdicao ? `${API_URL}/api/atletas/${atletaEmEdicao}` : `${API_URL}/api/atletas`;
        
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dadosAtleta)
        });

        if (!response.ok) throw new Error('Não foi possível salvar a atleta');

        alert('Atleta salva com sucesso!');
        formularioEdicao.style.display = 'none';
        buscarAtletas();
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar a atleta');
    }
});

cancelarEdicao.addEventListener('click', () => formularioEdicao.style.display = 'none');

adicionarAtletaButton.addEventListener('click', () => {
    editarAtletaForm.reset();
    atletaEmEdicao = null;
    formularioEdicao.style.display = 'block';
});

async function buscarAtletas() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_URL}/api/atletas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Não foi possível buscar as atletas');
        
        const atletas = await response.json();
        exibirAtletas(atletas);
    } catch (error) {
        console.error(error);
        tabelaAtletas.querySelector('tbody').innerHTML = `<tr><td colspan="3">Erro ao buscar as atletas</td></tr>`;
    }
}

function exibirAtletas(atletas) {
    const tbody = tabelaAtletas.querySelector('tbody');
    tbody.innerHTML = '';
    
    atletas.forEach(atleta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${atleta.nome_completo}</td>
            <td>${atleta.modalidade_id || 'Não informada'}</td>
            <td>
                <button class="editar" data-id="${atleta.id}">Editar</button>
                <button class="excluir" data-id="${atleta.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

async function buscarModalidades() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/modalidades`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Não foi possível buscar as modalidades');
        
        const modalidades = await response.json();
        preencherSelectModalidades(modalidades);
    } catch (error) {
        console.error('Erro ao buscar modalidades:', error);
        alert('Erro ao buscar as modalidades');
    }
}

function preencherSelectModalidades(modalidades) {
    const selectModalidades = document.getElementById('modalidade_id');
    selectModalidades.innerHTML = '<option value="" selected disabled>Selecione a Modalidade</option>';
    modalidades.forEach(modalidade => {
        const option = document.createElement('option');
        option.value = modalidade.id;
        option.textContent = modalidade.nome;
        selectModalidades.appendChild(option);
    });
}

buscarModalidades();
buscarAtletas();
