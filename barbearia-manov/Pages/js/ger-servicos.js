document.addEventListener('DOMContentLoaded', () => {

    // --- DADOS INICIAIS (extraídos do seu HTML 'fotos-cortes.html') ---
    let feedData = [
        { id: 1, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/jovem_2.png", titulo: "Cliente Satisfeito", texto: "Mais um cliente satisfeito.", valor: "R$ 40,00", ativo: true },
        { id: 2, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/jovem_3.png", titulo: "Sempre melhorando", texto: "Sempre melhorando nos cortes.", valor: "R$ 35,00", ativo: true },
        { id: 3, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/buzzcut.png", titulo: "Qualidade sempre🔥", texto: "Cliente satisfeito, e estiloso.", valor: "R$ 45,00", ativo: true },
        { id: 4, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/jovem_4.png", titulo: "Marque seu horário🥀", texto: "Agenda aberta pra semana.", valor: "R$ 35,00", ativo: true },
        { id: 5, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/social.png", titulo: "Pós Corte", texto: "Cortes luxuosos e estilosos, para qualquer idade.", valor: "R$ 50,00", ativo: true },
        { id: 6, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/jovem_5.png", titulo: "Venha ficar na régua📐", texto: "Sempre qualidade.", valor: "R$ 40,00", ativo: true },
        { id: 7, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/dreads.png", titulo: "Dreads", texto: "Também fazemos dreads, sempre prezando pela saúde e estilo do seu cabelo.", valor: "A partir de R$ 180,00", ativo: true },
        { id: 8, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/loiro.png", titulo: "Luzes", texto: "Também tingimos cabelos, prezando pela qualidade do serviço e seu tempo de duração.", valor: "A partir de R$ 90,00", ativo: true },
        { id: 9, imagemUrl: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/jovem.png", titulo: "Corte Jovial", texto: "Cortes do momento.", valor: "R$ 45,00", ativo: true }
    ];

    // --- ELEMENTOS DO DOM ---
    const feedForm = document.getElementById('feed-form');
    const feedIdInput = document.getElementById('feed-id');
    const imagemUrlInput = document.getElementById('imagem-url');
    const tituloInput = document.getElementById('titulo');
    const textoCardInput = document.getElementById('texto-card');
    const valorCardInput = document.getElementById('valor-card');
    const ativoCheckbox = document.getElementById('ativo');
    const btnClearForm = document.getElementById('btn-clear-form');
    const feedTableBody = document.getElementById('feed-table-body');

    // --- FUNÇÕES ---

    /**
     * Renderiza a tabela de cards com os dados atuais.
     */
    function renderFeedTable() {
        feedTableBody.innerHTML = '';
        feedData.forEach(item => {
            const row = feedTableBody.insertRow();
            row.innerHTML = `
                <td data-label="ID">${item.id}</td>
                <td data-label="Imagem"><img src="${item.imagemUrl}" alt="${item.titulo}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"></td>
                <td data-label="Título">${item.titulo}</td>
                <td data-label="Valor">${item.valor || '-'}</td>
                <td data-label="Ativo">${item.ativo ? 'Sim' : 'Não'}</td>
                <td data-label="Ações">
                    <div class="table-actions">
                        <button class="btn-action btn-edit" data-id="${item.id}">Editar</button>
                        <button class="btn-action btn-delete" data-id="${item.id}">Excluir</button>
                    </div>
                </td>
            `;
        });

        // Adiciona os eventos aos novos botões
        addEventListenersToButtons();
    }

    /**
     * Adiciona eventos de clique para os botões de editar e excluir.
     */
    function addEventListenersToButtons() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => fillFormForEdit(parseInt(e.target.dataset.id)));
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => deleteFeedItem(parseInt(e.target.dataset.id)));
        });
    }

    /**
     * Preenche o formulário com os dados de um card para edição.
     * @param {number} id - O ID do card a ser editado.
     */
    function fillFormForEdit(id) {
        const item = feedData.find(i => i.id === id);
        if (item) {
            feedIdInput.value = item.id;
            imagemUrlInput.value = item.imagemUrl;
            tituloInput.value = item.titulo;
            textoCardInput.value = item.texto;
            valorCardInput.value = item.valor;
            ativoCheckbox.checked = item.ativo;

            // Rola a página para o formulário para facilitar a edição
            feedForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Limpa todos os campos do formulário.
     */
    function clearForm() {
        feedForm.reset();
        feedIdInput.value = '';
        ativoCheckbox.checked = true; // Deixa 'ativo' como padrão
    }

    /**
     * Exclui um item do feed.
     * @param {number} id - O ID do item a ser excluído.
     */
    function deleteFeedItem(id) {
        if (confirm('Tem certeza que deseja excluir este card do feed? (Ação simulada)')) {
            feedData = feedData.filter(i => i.id !== id);
            renderFeedTable();
            alert('Card excluído com sucesso! (Simulado)');
            clearForm();
        }
    }

    // --- EVENT LISTENERS PRINCIPAIS ---

    feedForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = feedIdInput.value ? parseInt(feedIdInput.value) : null;

        const cardData = {
            imagemUrl: imagemUrlInput.value,
            titulo: tituloInput.value,
            texto: textoCardInput.value,
            valor: valorCardInput.value,
            ativo: ativoCheckbox.checked
        };

        if (id) {
            // Editando um card existente
            const index = feedData.findIndex(i => i.id === id);
            if (index !== -1) {
                feedData[index] = { ...feedData[index], ...cardData };
                alert('Card atualizado com sucesso! (Simulado)');
            }
        } else {
            // Adicionando um novo card
            const newId = feedData.length > 0 ? Math.max(...feedData.map(i => i.id)) + 1 : 1;
            feedData.push({ id: newId, ...cardData });
            alert('Card adicionado com sucesso! (Simulado)');
        }

        renderFeedTable();
        clearForm();
    });

    btnClearForm.addEventListener('click', clearForm);

    // --- INICIALIZAÇÃO ---
    renderFeedTable();
});