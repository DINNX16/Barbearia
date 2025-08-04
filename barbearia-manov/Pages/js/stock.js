document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');

    // Funções auxiliares para criar elementos HTML mais facilmente
    function createElement(tag, classes = [], attributes = {}, content = '') {
        const element = document.createElement(tag);
        if (classes.length > 0) element.className = classes.join(' ');
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        if (content) element.innerHTML = content;
        return element;
    }

    // Função centralizada para todas as chamadas de API
    async function fetchData(url, options = {}) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorBody = await response.text(); 
                let errorMessage = `Erro na requisição para ${url}: ${response.status} ${response.statusText}`;
                try {
                    const errorJson = JSON.parse(errorBody);
                    errorMessage = errorJson.message || errorMessage;
                } catch (e) {
                    // Não é um JSON, usa a mensagem HTTP padrão
                }
                throw new Error(errorMessage); 
            }
            return response.json();
        } catch (error) {
            console.error(`Erro na requisição para ${url}:`, error);
            throw error; 
        }
    }

    // Função para buscar e renderizar a lista de produtos
    async function fetchAndRenderProducts(searchTerm = '') {
        const productListContainer = document.getElementById('product-list-container');
        productListContainer.innerHTML = '<p class="mensagem-carregamento">Carregando produtos...</p>';

        try {
            let url = '/api/products';
            if (searchTerm) {
                url += `?q=${encodeURIComponent(searchTerm)}`;
            }
            const products = await fetchData(url);
            
            if (products.length === 0) {
                productListContainer.innerHTML = '<p class="mensagem-carregamento">Nenhum produto encontrado.</p>';
            } else {
                renderProductList(products);
            }
            updateGeneralSummary(products);

        } catch (error) {
            productListContainer.innerHTML = `<p class="mensagem-erro-formulario">Erro ao carregar produtos: ${error.message}</p>`;
        }
    }

    // Função para renderizar a tabela de produtos
    function renderProductList(products) {
        const productListContainer = document.getElementById('product-list-container');
        
        let tableHtml = `
            <table class="tabela-dados-produto">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Quantidade</th>
                        <th>Preço Venda (R$)</th>
                        <th>Data Validade</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;

        products.forEach(product => {
            const expiryDate = product.data_validade ? new Date(product.data_validade).toLocaleDateString('pt-BR') : 'N/A';
            
            const rowClasses = [];
            if (product.quantidade_estoque <= product.estoque_minimo) {
                rowClasses.push('linha-estoque-baixo');
            }

            tableHtml += `
                <tr class="${rowClasses.join(' ')}">
                    <td>${product.nome}</td>
                    <td>
                        ${product.quantidade_estoque}
                        ${product.quantidade_estoque <= product.estoque_minimo ? '<span class="texto-estoque-baixo">(Baixo!)</span>' : ''}
                    </td>
                    <td>R$ ${product.preco_venda.toFixed(2)}</td>
                    <td>${expiryDate}</td>
                    <td>
                        <button class="link-acao-tabela" onclick="openProductModal(${product.id_produto})">Editar</button>
                        <button class="link-acao-tabela" onclick="openPromotionModal(${product.id_produto})">Promoção</button>
                    </td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;
        productListContainer.innerHTML = tableHtml;
    }

    // Função para atualizar o resumo geral do estoque
    function updateGeneralSummary(products) {
        let totalProducts = products.length;
        let totalValueSale = products.reduce((sum, p) => sum + (p.preco_venda * p.quantidade_estoque), 0);
        let totalValueCost = products.reduce((sum, p) => sum + (p.preco_compra * p.quantidade_estoque), 0);

        document.getElementById('total-products').textContent = totalProducts;
        document.getElementById('total-value-sale').textContent = `R$ ${totalValueSale.toFixed(2)}`;
        document.getElementById('total-value-cost').textContent = `R$ ${totalValueCost.toFixed(2)}`;
    }

    // Função para buscar e renderizar os alertas
    async function fetchAndRenderAlerts() {
        const stockAlertsDiv = document.getElementById('stock-alerts');
        stockAlertsDiv.innerHTML = '<p class="mensagem-carregamento">Carregando alertas...</p>';

        try {
            const lowStockAlerts = await fetchData('/api/alerts/low-stock');
            const nearExpiryAlerts = await fetchData('/api/alerts/near-expiry'); 

            let alertsHtml = '';
            if (lowStockAlerts.length === 0 && nearExpiryAlerts.length === 0) {
                alertsHtml = '<p class="item-alerta alerta-sem-problemas">Nenhum alerta de estoque no momento. Tudo certo!</p>';
            } else {
                lowStockAlerts.forEach(alert => {
                    alertsHtml += `<p class="item-alerta alerta-estoque-baixo">
                                        🚨 Estoque Baixo: ${alert.nome} (${alert.quantidade_estoque} no estoque. Mínimo: ${alert.estoque_minimo})
                                    </p>`;
                });
                nearExpiryAlerts.forEach(alert => {
                    alertsHtml += `<p class="item-alerta alerta-quase-vencimento">
                                        ⚠️ Próximo da Validade: ${new Date().getFullYear() > new Date(alert.data_validade).getFullYear() ? 'Validade Expirada' : 'Validade Próxima'}: ${alert.nome} (Vencimento: ${new Date(alert.data_validade).toLocaleDateString('pt-BR')})
                                    </p>`;
                });
            }
            stockAlertsDiv.innerHTML = alertsHtml;

        } catch (error) {
            stockAlertsDiv.innerHTML = `<p class="mensagem-erro-formulario">Erro ao carregar alertas: ${error.message}</p>`;
        }
    }

    // --- FUNÇÕES PARA CONFIGURAÇÃO DE ALERTA DE VALIDADE ---

    async function fetchExpiryNotificationSetting() {
        const daysBeforeExpiryInput = document.getElementById('days-before-expiry');
        const statusElement = document.getElementById('expiry-setting-status');
        statusElement.textContent = 'Carregando configuração...';
        statusElement.className = 'mensagem-status info';

        try {
            const config = await fetchData('/api/barberia/config/expiry-alert'); 
            daysBeforeExpiryInput.value = config.dias_aviso_validade_produto;
            statusElement.textContent = `Configuração atual: ${config.dias_aviso_validade_produto} dias.`;
            statusElement.className = 'mensagem-status sucesso';
        } catch (error) {
            daysBeforeExpiryInput.value = 90; 
            statusElement.textContent = `Erro ao carregar configuração. Padrão: 90 dias.`;
            statusElement.className = 'mensagem-status erro';
        }
    }

    async function saveExpiryNotificationSetting() {
        const daysBeforeExpiryInput = document.getElementById('days-before-expiry');
        const statusElement = document.getElementById('expiry-setting-status');
        const newValue = parseInt(daysBeforeExpiryInput.value, 10);

        if (isNaN(newValue) || newValue < 1 || newValue > 365) {
            statusElement.textContent = 'Por favor, insira um número válido entre 1 e 365.';
            statusElement.className = 'mensagem-status erro';
            return;
        }

        statusElement.textContent = 'Salvando...';
        statusElement.className = 'mensagem-status info';

        try {
            await fetchData('/api/barberia/config/expiry-alert', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ dias_aviso_validade_produto: newValue }),
            });

            statusElement.textContent = `Configuração salva: ${newValue} dias.`;
            statusElement.className = 'mensagem-status sucesso';
            fetchAndRenderAlerts(); 
        } catch (error) {
            statusElement.textContent = `Erro ao salvar: ${error.message}`;
            statusElement.className = 'mensagem-status erro';
        }
    }

    // --- FUNÇÕES DE AÇÃO E MODAIS ---

    function handleSearch() {
        const searchTerm = document.getElementById('search-input').value;
        fetchAndRenderProducts(searchTerm);
    }

    // Função genérica para abrir modais
    function openModal(modalId, title, contentHtml) {
        const modalContainer = document.getElementById(modalId);
        modalContainer.innerHTML = `
            <div class="overlay-modal">
                <div class="area-conteudo-modal">
                    <div class="secao-cabecalho-modal">
                        <h3 class="titulo-modal">${title}</h3>
                        <button class="botao-fechar-modal" onclick="window.closeModal('${modalId}')">&times;</button>
                    </div>
                    <div id="${modalId}-content">
                        ${contentHtml}
                    </div>
                </div>
            </div>
        `;
        // Adiciona um listener para fechar o modal ao clicar fora dele
        modalContainer.querySelector('.overlay-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) { 
                window.closeModal(modalId);
            }
        });
        // Adiciona a classe ao body para controlar o scroll
        document.body.classList.add('modal-aberto');
    }

    // Função genérica para fechar modais e recarregar dados
    function closeModal(modalId) {
        document.getElementById(modalId).innerHTML = ''; // Limpa o conteúdo do modal
        document.body.classList.remove('modal-aberto'); // Remove a classe do body
        fetchAndRenderProducts(); // Recarrega a lista de produtos após fechar
        fetchAndRenderAlerts();   // Recarrega alertas (para movimentação e configuração)
    }

    async function openProductModal(productId = null) {
        let product = null;
        if (productId) {
            try {
                product = await fetchData(`/api/products/${productId}`);
            } catch (error) {
                alert(`Erro ao carregar produto: ${error.message}`);
                return;
            }
        }

        const contentHtml = `
            <form id="product-form" class="grupo-input-formulario">
                <div class="grupo-input-formulario">
                    <label for="product-name" class="label-formulario">Nome do Produto:</label>
                    <input type="text" id="product-name" name="nome" value="${product ? product.nome : ''}" required
                        class="campo-texto-formulario">
                </div>
                <div class="grupo-input-formulario">
                    <label for="product-description" class="label-formulario">Descrição:</label>
                    <textarea id="product-description" name="descricao" rows="3" required
                        class="textarea-formulario">${product ? product.descricao : ''}</textarea>
                </div>
                <div class="grid-colunas-2-espaco-4">
                    <div class="grupo-input-formulario">
                        <label for="product-price-sale" class="label-formulario">Preço de Venda (R$):</label>
                        <input type="number" id="product-price-sale" name="preco_venda" value="${product ? product.preco_venda : ''}" step="0.01" required
                            class="campo-texto-formulario">
                    </div>
                    <div class="grupo-input-formulario">
                        <label for="product-price-purchase" class="label-formulario">Preço de Compra (R$)::</label>
                        <input type="number" id="product-price-purchase" name="preco_compra" value="${product ? product.preco_compra : ''}" step="0.01" required
                            class="campo-texto-formulario">
                    </div>
                </div>
                <div class="grid-colunas-2-espaco-4">
                    <div class="grupo-input-formulario">
                        <label for="product-stock-quantity" class="label-formulario">Quantidade em Estoque:</label>
                        <input type="number" id="product-stock-quantity" name="quantidade_estoque" value="${product ? product.quantidade_estoque : ''}" required
                            class="campo-texto-formulario">
                    </div>
                    <div class="grupo-input-formulario">
                        <label for="product-min-stock" class="label-formulario">Estoque Mínimo:</label>
                        <input type="number" id="product-min-stock" name="estoque_minimo" value="${product ? product.estoque_minimo : ''}" required
                            class="campo-texto-formulario">
                    </div>
                </div>
                <div class="grupo-input-formulario">
                    <label for="product-expiry-date" class="label-formulario">Data de Validade:</label>
                    <input type="date" id="product-expiry-date" name="data_validade" value="${product && product.data_validade ? product.data_validade.split('T')[0] : ''}"
                        class="campo-texto-formulario">
                </div>
                <div class="grupo-input-formulario">
                    <label for="product-category" class="label-formulario">Categoria:</label>
                    <select id="product-category" name="categoria" required
                        class="select-formulario">
                        <option value="cosmetico" ${product && product.categoria === 'cosmetico' ? 'selected' : ''}>Cosmético</option>
                        <option value="equipamento" ${product && product.categoria === 'equipamento' ? 'selected' : ''}>Equipamento</option>
                        <option value="acessorio" ${product && product.categoria === 'acessorio' ? 'selected' : ''}>Acessório</option>
                        <option value="outros" ${product && product.categoria === 'outros' ? 'selected' : ''}>Outros</option>
                    </select>
                </div>
                
                <div class="botoes-acao-formulario">
                    <button type="button" class="botao-acao botao-secundario" onclick="window.closeModal('product-modal-container')">Cancelar</button>
                    <button type="submit" class="botao-acao botao-primario">Salvar</button>
                </div>
            </form>
        `;
        openModal('product-modal-container', productId ? 'Editar Produto' : 'Adicionar Novo Produto', contentHtml);

        document.getElementById('product-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const productData = Object.fromEntries(formData.entries());

            productData.preco_venda = parseFloat(productData.preco_venda);
            productData.preco_compra = parseFloat(productData.preco_compra);
            productData.quantidade_estoque = parseInt(productData.quantidade_estoque, 10);
            productData.estoque_minimo = parseInt(productData.estoque_minimo, 10);

            if (productData.data_validade === '') {
                productData.data_validade = null;
            }

            try {
                const url = productId ? `/api/products/${productId}` : '/api/products';
                const method = productId ? 'PUT' : 'POST';

                await fetchData(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData),
                });

                alert('Produto salvo com sucesso!');
                window.closeModal('product-modal-container');
            } catch (error) {
                alert(`Erro ao salvar produto: ${error.message}`);
            }
        });
    }

    async function openMovementModal() {
        let products = [];
        try {
            products = await fetchData('/api/products');
        } catch (error) {
            alert(`Erro ao carregar produtos para movimentação: ${error.message}`);
            return;
        }

        let productOptions = products.map(p => `<option value="${p.id_produto}">${p.nome}</option>`).join('');
        if (products.length === 0) {
            productOptions = '<option value="">Nenhum produto cadastrado</option>';
        } else {
            productOptions = '<option value="">Selecione um produto</option>' + productOptions;
        }

        const contentHtml = `
            <form id="movement-form" class="grupo-input-formulario">
                <div class="grupo-input-formulario">
                    <label for="movement-product-select" class="label-formulario">Produto:</label>
                    <select id="movement-product-select" name="id_produto" required
                        class="select-formulario">
                        ${productOptions}
                    </select>
                </div>
                <div class="grupo-input-formulario">
                    <label class="label-formulario">Tipo de Movimentação:</label>
                    <div class="grupo-selecao-radio">
                        <input type="radio" id="type-entrada" name="tipo_movimentacao" value="ENTRADA" required>
                        <label for="type-entrada">Entrada</label>
                        <input type="radio" id="type-saida" name="tipo_movimentacao" value="SAIDA" required>
                        <label for="type-saida">Saída</label>
                    </div>
                </div>
                <div class="grupo-input-formulario">
                    <label for="movement-quantity" class="label-formulario">Quantidade:</label>
                    <input type="number" id="movement-quantity" name="quantidade" min="1" required
                        class="campo-texto-formulario">
                </div>
                <div class="grupo-input-formulario">
                    <label for="movement-reason" class="label-formulario">Motivo:</label>
                    <textarea id="movement-reason" name="motivo" rows="3"
                        class="textarea-formulario"></textarea>
                </div>
                <div class="botoes-acao-formulario">
                    <button type="button" class="botao-acao botao-secundario" onclick="window.closeModal('movement-modal-container')">Cancelar</button>
                    <button type="submit" class="botao-acao botao-info">Registrar</button>
                </div>
            </form>
        `;
        openModal('movement-modal-container', 'Registrar Movimentação de Estoque', contentHtml);

        document.getElementById('movement-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const movementData = Object.fromEntries(formData.entries());

            movementData.id_produto = parseInt(movementData.id_produto, 10);
            movementData.quantidade = parseInt(movementData.quantidade, 10);

            try {
                await fetchData('/api/stock-movements', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(movementData),
                });

                alert('Movimentação registrada com sucesso!');
                window.closeModal('movement-modal-container');
            } catch (error) {
                alert(`Erro ao registrar movimentação: ${error.message}`);
            }
        });
    }

    async function openPromotionModal(productId) {
        let productName = 'Produto Selecionado';
        try {
            const product = await fetchData(`/api/products/${productId}`);
            productName = product.nome;
        } catch (error) {
            console.error('Erro ao carregar nome do produto para promoção:', error);
        }

        const contentHtml = `
            <form id="promotion-form" class="grupo-input-formulario">
                <div class="grupo-input-formulario">
                    <label for="promotion-product-name" class="label-formulario">Produto:</label>
                    <input type="text" id="promotion-product-name" value="${productName}" class="campo-texto-formulario somente-leitura" readonly>
                    <input type="hidden" id="promotion-product-id" name="id_produto" value="${productId}">
                </div>
                <div class="grupo-input-formulario">
                    <label for="discount-percentage" class="label-formulario">Porcentagem de Desconto (%):</label>
                    <input type="number" id="discount-percentage" name="porcentagem_desconto" min="1" max="100" step="0.01" required
                        class="campo-texto-formulario">
                </div>
                <div class="grid-colunas-2-espaco-4">
                    <div class="grupo-input-formulario">
                        <label for="start-date" class="label-formulario">Data de Início:</label>
                        <input type="date" id="start-date" name="data_inicio" required
                            class="campo-texto-formulario">
                    </div>
                    <div class="grupo-input-formulario">
                        <label for="end-date" class="label-formulario">Data de Fim:</label>
                        <input type="date" id="end-date" name="data_fim" required
                            class="campo-texto-formulario">
                    </div>
                </div>
                <div class="botoes-acao-formulario">
                    <button type="button" class="botao-acao botao-secundario" onclick="window.closeModal('promotion-modal-container')">Cancelar</button>
                    <button type="submit" class="botao-acao botao-primario">Criar Promoção</button>
                </div>
            </form>
        `;
        openModal('promotion-modal-container', `Criar Promoção para ${productName}`, contentHtml);

        document.getElementById('promotion-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const promotionData = Object.fromEntries(formData.entries());

            promotionData.id_produto = parseInt(promotionData.id_produto, 10);
            promotionData.porcentagem_desconto = parseFloat(promotionData.porcentagem_desconto);

            try {
                await fetchData('/api/promotions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(promotionData),
                });

                alert('Promoção criada com sucesso!');
                window.closeModal('promotion-modal-container');
            } catch (error) {
                alert(`Erro ao criar promoção: ${error.message}`);
            }
        });
    }

    function handleExportReport() {
        alert('Funcionalidade de exportar relatório será implementada no backend e aqui!');
    }

    // Configura os listeners dos botões principais
    document.getElementById('search-button').addEventListener('click', handleSearch);
    document.getElementById('add-product-button').addEventListener('click', () => openProductModal());
    document.getElementById('register-movement-button').addEventListener('click', () => openMovementModal());
    document.getElementById('export-report-button').addEventListener('click', handleExportReport);
    document.getElementById('save-expiry-setting-button').addEventListener('click', saveExpiryNotificationSetting);

    // Carrega dados iniciais
    fetchAndRenderProducts();
    fetchExpiryNotificationSetting();
    fetchAndRenderAlerts();

    // Exporta funções para serem acessíveis globalmente
    window.openProductModal = openProductModal;
    window.closeModal = closeModal; 
    window.openMovementModal = openMovementModal;
    window.openPromotionModal = openPromotionModal;
});