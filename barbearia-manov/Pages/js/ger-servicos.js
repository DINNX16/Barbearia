// js/ger-servicos.js - VERSÃO FINAL E CORRIGIDA
document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const feedForm = document.getElementById('feed-form');
    const feedIdInput = document.getElementById('feed-id');
    const imagemUrlInput = document.getElementById('imagem-url');
    const tituloInput = document.getElementById('titulo');
    const textoCardInput = document.getElementById('texto-card');
    const valorCardInput = document.getElementById('valor-card');
    const tipoServicoSelect = document.getElementById('tipo-servico');
    const ativoCheckbox = document.getElementById('ativo');
    const btnClearForm = document.getElementById('btn-clear-form');
    const feedTableBody = document.getElementById('feed-table-body');
    const API_URL = 'http://localhost:3000/api/galeria';

    let feedData = [];

    // --- FUNÇÕES DA API ---
    async function fetchFeedData() {
        try {
            const token = localStorage.getItem('jwtToken'); // <-- Lendo o nome CORRETO
            if (!token) {
                feedTableBody.innerHTML = `<tr><td colspan="6">Você precisa estar logado para gerenciar o feed.</td></tr>`;
                return;
            }

            const response = await fetch('http://localhost:3000/api/galeria', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 403 || response.status === 401) {
                    throw new Error('Sessão inválida ou expirada. Faça login novamente.');
                }
                throw new Error('Falha ao buscar dados');
            }
            feedData = await response.json();
            renderFeedTable();
        } catch (error) {
            console.error('Erro:', error);
            feedTableBody.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
        }
    }

    // --- FUNÇÕES DE RENDERIZAÇÃO E FORMULÁRIO ---
    function renderFeedTable() {
        feedTableBody.innerHTML = '';
        feedData.forEach(item => {
            const row = feedTableBody.insertRow();
            row.innerHTML = `
                <td data-label="ID">${item.id_foto}</td>
                <td data-label="Imagem"><img src="${item.imagem_caminho || ''}" alt="${item.titulo}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;"></td>
                <td data-label="Título">${item.titulo}</td>
                <td data-label="Valor">${item.valor || '-'}</td>
                <td data-label="Ativo">${item.ativo ? 'Sim' : 'Não'}</td>
                <td data-label="Ações">
                    <div class="table-actions">
                        <button class="btn-action btn-edit" data-id="${item.id_foto}">Editar</button>
                        <button class="btn-action btn-delete" data-id="${item.id_foto}">Excluir</button>
                    </div>
                </td>
            `;
        });
        addEventListenersToButtons();
    }

    function addEventListenersToButtons() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => fillFormForEdit(parseInt(e.target.dataset.id)));
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => deleteFeedItem(parseInt(e.target.dataset.id)));
        });
    }

    function fillFormForEdit(id) {
        const item = feedData.find(i => i.id_foto === id);
        if (item) {
            feedIdInput.value = item.id_foto;
            imagemUrlInput.value = item.imagem_caminho;
            tituloInput.value = item.titulo;
            textoCardInput.value = item.descricao;
            valorCardInput.value = item.valor;
            tipoServicoSelect.value = item.tipo_servico;
            ativoCheckbox.checked = item.ativo;
            feedForm.scrollIntoView({ behavior: 'smooth' });
        }
    }

    function clearForm() {
        feedForm.reset();
        feedIdInput.value = '';
        ativoCheckbox.checked = true;
    }

    async function deleteFeedItem(id) {
        if (confirm('Tem certeza que deseja excluir este card?')) {
            try {
                const token = localStorage.getItem('jwtToken'); // <-- Lendo o nome CORRETO
                if (!token) { alert('Você precisa estar logado para realizar esta ação.'); return; }

                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Falha ao excluir');
                await fetchFeedData();
                clearForm();
            } catch (error) {
                console.error('Erro:', error);
                alert('Não foi possível excluir o card.');
            }
        }
    }

    // --- EVENT LISTENERS PRINCIPAIS ---
    feedForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = feedIdInput.value ? parseInt(feedIdInput.value) : null;
        const cardData = {
            imagem_caminho: imagemUrlInput.value,
            titulo: tituloInput.value,
            descricao: textoCardInput.value,
            valor: valorCardInput.value,
            tipo_servico: tipoServicoSelect.value,
            ativo: ativoCheckbox.checked
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;
        const token = localStorage.getItem('jwtToken'); // <-- Lendo o nome CORRETO
        if (!token) { alert('Você precisa estar logado para realizar esta ação.'); return; }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(cardData)
            });
            if (!response.ok) throw new Error('Falha ao salvar');
            await fetchFeedData();
            clearForm();
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível salvar o card.');
        }
    });

    btnClearForm.addEventListener('click', clearForm);

    // --- INICIALIZAÇÃO ---
    fetchFeedData();
});