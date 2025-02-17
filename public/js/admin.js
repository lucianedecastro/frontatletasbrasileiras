const API_URL = window.location.hostname.includes('localhost') ? 'http://localhost:3000' : 'https://api.atletasbrasileiras.com.br';

const tabelaAtletas = document.getElementById('tabela-atletas');
const formularioEdicao = document.getElementById('formulario-edicao');
const editarAtletaForm = document.getElementById('editar-atleta-form');
const cancelarEdicao = document.getElementById('cancelar-edicao');
const adicionarAtletaButton = document.getElementById('adicionarAtleta');
let atletaEmEdicao = null;

// Função para buscar os dados de uma atleta específica e preencher o formulário
async function preencherFormularioEdicao(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/atletas/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Não foi possível buscar a atleta');
        }

        const atleta = await response.json();

        const nomeCompletoInput = document.getElementById('nome_completo');
        const dataNascimentoInput = document.getElementById('data_nascimento');
        const modalidadeEsportivaInput = document.getElementById('modalidade_id');
        const principaisConquistasTextarea = document.getElementById('principais_conquistas');
        const fonteInformacaoInput = document.getElementById('fonte_informacao');
        const outrasInformacoesTextarea = document.getElementById('outras_informacoes');

        if (nomeCompletoInput) nomeCompletoInput.value = atleta.nome_completo;
        if (dataNascimentoInput) dataNascimentoInput.value = atleta.data_nascimento ? atleta.data_nascimento.split('T')[0] : '';
        if (modalidadeEsportivaInput) modalidadeEsportivaInput.value = atleta.modalidade_id;
        if (principaisConquistasTextarea) principaisConquistasTextarea.value = atleta.principais_conquistas;
        if (fonteInformacaoInput) fonteInformacaoInput.value = atleta.fonte_informacao;
        if (outrasInformacoesTextarea) outrasInformacoesTextarea.value = atleta.outras_informacoes;

        atletaEmEdicao = id; //Armazena o ID da atleta que está sendo editada
        formularioEdicao.style.display = 'block'; //Mostrar o formulário de edição
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao preencher o formulário de edição');
    }
}

//Manipulador de eventos para os botões "Editar" e "Excluir"
tabelaAtletas.addEventListener('click', async (event) => {
    const botao = event.target;
    const id = botao.dataset.id;

    if (botao.classList.contains('editar')) {
        preencherFormularioEdicao(id);
    }

    if (botao.classList.contains('excluir')) {
        const confirmacao = confirm('Tem certeza que deseja excluir esta atleta?');

        if (confirmacao) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:3000/admin/atletas/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Não foi possível excluir a atleta');
                }

                alert('Atleta excluída com sucesso!');
                buscarAtletas(); //Atualiza a tabela de atletas
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao excluir a atleta');
            }
        }
    }
});

// Manipulador de eventos para o formulário de edição
editarAtletaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome_completo = document.getElementById('nome_completo').value;
    const data_nascimento = document.getElementById('data_nascimento').value;
    const modalidade_id = document.getElementById('modalidade_id').value;
    const principais_conquistas = document.getElementById('principais_conquistas').value;
    const fonte_informacao = document.getElementById('fonte_informacao').value;
    const outras_informacoes = document.getElementById('outras_informacoes').value;

    try {
        const token = localStorage.getItem('token');
        let response;
        if (atletaEmEdicao) { // Se estiver editando
            response = await fetch(`http://localhost:3000/admin/atletas/${atletaEmEdicao}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes })
            });
        } else { // Se estiver criando
            response = await fetch(`http://localhost:3000/admin/atletas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ nome_completo, data_nascimento, modalidade_id, principais_conquistas, fonte_informacao, outras_informacoes })
            });
        }

        if (!response.ok) {
            throw new Error('Não foi possível salvar a atleta');
        }

        alert('Atleta salva com sucesso!');
        formularioEdicao.style.display = 'none'; //Oculta o formulário de edição
        buscarAtletas(); //Atualiza a tabela de atletas
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar a atleta');
    }
});

//Manipulador de eventos para o botão "Cancelar"
cancelarEdicao.addEventListener('click', () => {
    formularioEdicao.style.display = 'none'; //Oculta o formulário de edição
});

//Manipulador de eventos para o botão "Adicionar Atleta"
adicionarAtletaButton.addEventListener('click', () => {
    //Limpar o formulário
    document.getElementById('nome_completo').value = '';
    document.getElementById('data_nascimento').value = '';
    document.getElementById('modalidade_id').value = '';
    document.getElementById('principais_conquistas').value = '';
    document.getElementById('fonte_informacao').value = '';
    document.getElementById('outras_informacoes').value = '';

    atletaEmEdicao = null; //Limpar o ID da atleta em edição
    formularioEdicao.style.display = 'block'; //Mostrar o formulário
});

// Função para buscar as atletas e exibir na tabela (já existente)
async function buscarAtletas() {
    console.log("Função buscarAtletas() chamada"); //Adicionado para depuração
    try {
        // Obter o token do localStorage
        const token = localStorage.getItem('token');
        console.log("Token lido do localStorage:", token); // Adicionado para depuração

        // Verificar se o token existe
        if (!token) {
            // Redirecionar para a página de login
            window.location.href = 'login.html';
            return; // Importante para evitar que o código continue executando
        }

        // Fazer a requisição para a rota /admin/atletas
        const response = await fetch('http://localhost:3000/admin/atletas', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        // Verificar se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error('Não foi possível buscar as atletas');
        }

        // Converter a resposta para JSON
        const atletas = await response.json();

        // Exibir as atletas na tabela
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
            <td>${atleta.modalidade_id}</td>
            <td>
                <button class="editar" data-id="${atleta.id}">Editar</button>
                <button class="excluir" data-id="${atleta.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Função para buscar as modalidades do backend e preencher o select
async function buscarModalidades() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/admin/modalidades', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Não foi possível buscar as modalidades');
        }

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

// Chamar a função para buscar as atletas ao carregar a página
buscarModalidades();
buscarAtletas();