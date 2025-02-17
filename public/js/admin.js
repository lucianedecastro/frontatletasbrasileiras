document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redireciona para o login se não tiver token
        return;
    }

    const tabelaAtletas = document.getElementById('tabela-atletas').getElementsByTagName('tbody')[0];
    const formularioEdicao = document.getElementById('formulario-edicao');
    const editarAtletaForm = document.getElementById('editar-atleta-form');
    const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');
    const adicionarAtletaBtn = document.getElementById('adicionarAtleta');

    let atletas = [];
    let modalidades = [];
    let atletaEmEdicao = null;


    // Função para buscar as atletas da API
    async function buscarAtletas() {
        try {
            const response = await fetch('https://www.atletasbrasileiras.com.br/atletas', {  // Use o domínio real!
                headers: {
                    'Authorization': `Bearer ${token}` // Envia o token no header
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }
                throw new Error(`Erro ao buscar atletas: ${response.status}`);
            }

            atletas = await response.json();
            popularTabelaAtletas();
        } catch (error) {
            console.error('Erro ao buscar atletas:', error);
            alert('Erro ao buscar atletas. Consulte o console para mais detalhes.');
        }
    }

  // Função para buscar as modalidades da API e popular o select
  async function buscarModalidades() {
    try {
      const response = await fetch('URL_DA_SUA_API_DE_MODALIDADES', { // Substitua pela URL correta
        headers: {
          'Authorization': `Bearer ${token}` // Envia o token no header
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar modalidades: ${response.status}`);
      }

      modalidades = await response.json();
      popularSelectModalidades();
    } catch (error) {
      console.error('Erro ao buscar modalidades:', error);
      alert('Erro ao buscar modalidades. Consulte o console para mais detalhes.');
    }
  }


     // Função para popular a tabela de atletas
     function popularTabelaAtletas() {
            tabelaAtletas.innerHTML = ''; // Limpa a tabela

            atletas.forEach(atleta => {
                let row = tabelaAtletas.insertRow();
                let nomeCell = row.insertCell(0);
                let modalidadeCell = row.insertCell(1);
                let acoesCell = row.insertCell(2);

                nomeCell.textContent = atleta.nome_completo;
                modalidadeCell.textContent = atleta.modalidade_nome;
                acoesCell.innerHTML = `
                    <button class="editar-atleta" data-id="${atleta.id}">Editar</button>
                    <button class="excluir-atleta" data-id="${atleta.id}">Excluir</button>
                `;
            });

            // Adiciona os event listeners para os botões de editar e excluir
            document.querySelectorAll('.editar-atleta').forEach(button => {
                button.addEventListener('click', editarAtleta);
            });
            document.querySelectorAll('.excluir-atleta').forEach(button => {
                button.addEventListener('click', excluirAtleta);
            });
        }

     // Função para popular o select de modalidades no formulário de edição
     function popularSelectModalidades() {
        const selectModalidade = document.getElementById('modalidade_id');
        selectModalidade.innerHTML = '<option value="" selected disabled>Selecione a Modalidade</option>'; // Limpa e adiciona a opção padrão

        modalidades.forEach(modalidade => {
            const option = document.createElement('option');
            option.value = modalidade.id;
            option.textContent = modalidade.nome;
            selectModalidade.appendChild(option);
        });
    }

    // Função para preparar o formulário de edição com os dados da atleta selecionada
    function editarAtleta(event) {
        const atletaId = event.target.dataset.id;
        atletaEmEdicao = atletas.find(atleta => atleta.id === parseInt(atletaId));

        if (!atletaEmEdicao) {
            console.error('Atleta não encontrada para edição.');
            return;
        }

        // Preenche os campos do formulário com os dados da atleta
        document.getElementById('nome_completo').value = atletaEmEdicao.nome_completo;
        document.getElementById('data_nascimento').value = atletaEmEdicao.data_nascimento;
        document.getElementById('modalidade_id').value = atletaEmEdicao.modalidade_id;
        document.getElementById('principais_conquistas').value = atletaEmEdicao.principais_conquistas;
        document.getElementById('fonte_informacao').value = atletaEmEdicao.fonte_informacao;
        document.getElementById('outras_informacoes').value = atletaEmEdicao.outras_informacoes;


        formularioEdicao.style.display = 'block';
    }

    // Event listener para o envio do formulário de edição
    editarAtletaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const atletaAtualizada = {
            id: atletaEmEdicao.id,
            nome_completo: document.getElementById('nome_completo').value,
            data_nascimento: document.getElementById('data_nascimento').value,
            modalidade_id: document.getElementById('modalidade_id').value,
            principais_conquistas: document.getElementById('principais_conquistas').value,
            fonte_informacao: document.getElementById('fonte_informacao').value,
            outras_informacoes: document.getElementById('outras_informacoes').value
        };

        try {
            const response = await fetch(`https://www.atletasbrasileiras.com.br/atletas/${atletaEmEdicao.id}`, { // Use o domínio real!
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(atletaAtualizada)
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar atleta: ${response.status}`);
            }

            // Atualiza a atleta na lista local e na tabela
            atletas = atletas.map(atleta => atleta.id === atletaAtualizada.id ? atletaAtualizada : atleta);
            popularTabelaAtletas();
            fecharFormularioEdicao();
            alert('Atleta atualizada com sucesso!');

        } catch (error) {
            console.error('Erro ao atualizar atleta:', error);
            alert('Erro ao atualizar atleta. Consulte o console para mais detalhes.');
        }
    });

    // Função para excluir uma atleta
    async function excluirAtleta(event) {
        const atletaId = event.target.dataset.id;

        if (confirm('Tem certeza que deseja excluir esta atleta?')) {
            try {
                const response = await fetch(`https://www.atletasbrasileiras.com.br/atletas/${atletaId}`, { // Use o domínio real!
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro ao excluir atleta: ${response.status}`);
                }

                // Remove a atleta da lista local e da tabela
                atletas = atletas.filter(atleta => atleta.id !== parseInt(atletaId));
                popularTabelaAtletas();
                alert('Atleta excluída com sucesso!');

            } catch (error) {
                console.error('Erro ao excluir atleta:', error);
                alert('Erro ao excluir atleta. Consulte o console para mais detalhes.');
            }
        }
    }


    // Função para fechar o formulário de edição
    function fecharFormularioEdicao() {
        formularioEdicao.style.display = 'none';
        atletaEmEdicao = null;
    }

    // Event listener para o botão de cancelar a edição
    cancelarEdicaoBtn.addEventListener('click', fecharFormularioEdicao);
    adicionarAtletaBtn.addEventListener('click', adicionarAtleta);
    
        // Função para adicionar uma nova atleta
    async function adicionarAtleta() {
        // Implemente a lógica para exibir um formulário de adição e enviar os dados para a API
        alert('Implementar lógica para adicionar atleta.');
    }

    // Carrega as atletas e modalidades ao carregar a página
    buscarAtletas();
    buscarModalidades();
});