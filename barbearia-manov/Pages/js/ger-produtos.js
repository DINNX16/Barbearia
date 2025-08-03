document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do formulário
    const productForm = document.getElementById('product-form');
    const productIdInput = document.getElementById('product-id');
    const productSourceInput = document.getElementById('product-source');
    const titleInput = document.getElementById('title');
    const priceInput = document.getElementById('price');
    const iconInput = document.getElementById('icon');
    const categoryInput = document.getElementById('category');
    const brandInput = document.getElementById('brand');
    const clearFormBtn = document.getElementById('btn-clear-form');
    const productsTableBody = document.getElementById('products-table-body');

    // Função para renderizar a tabela de produtos
    function renderProductsTable() {
        productsTableBody.innerHTML = ''; // Limpa a tabela

        // Itera sobre cada array de produtos definido em database.js
        for (const sourceName in allProductSources) {
            const productArray = allProductSources[sourceName];
            productArray.forEach(product => {
                const row = productsTableBody.insertRow();
                row.innerHTML = `
                    <td data-label="ID">${product.id}</td>
                    <td data-label="Título">${product.title}</td>
                    <td data-label="Preço">R$ ${product.price}</td>
                    <td data-label="Categoria">${product.category || '-'}</td>
                    <td data-label="Marca">${product.brand || '-'}</td>
                    <td data-label="Ações" class="actions-cell">
                        <div class="table-actions">
                            <button class="btn-action btn-edit" data-id="${product.id}" data-source="${sourceName}">Editar</button>
                            <button class="btn-action btn-delete" data-id="${product.id}" data-source="${sourceName}">Excluir</button>
                        </div>
                    </td>
                `;
            });
        }
        addEventListenersToButtons();
    }

    // Função para adicionar eventos aos botões de ação da tabela
    function addEventListenersToButtons() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const source = e.target.dataset.source;
                fillFormForEdit(id, source);
            });
        });
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const source = e.target.dataset.source;
                deleteProduct(id, source);
            });
        });
    }

    // Preenche o formulário para edição
    function fillFormForEdit(id, source) {
        const product = allProductSources[source].find(p => p.id === id);
        if (product) {
            productIdInput.value = product.id;
            productSourceInput.value = source;
            titleInput.value = product.title;
            priceInput.value = product.price;
            iconInput.value = product.icon;
            categoryInput.value = product.category || '';
            brandInput.value = product.brand || '';

            productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Limpa o formulário
    function clearForm() {
        productForm.reset();
        productIdInput.value = '';
        productSourceInput.value = '';
    }

    // Deleta um produto (Simulado, apenas em memória)
    function deleteProduct(id, source) {
        if (confirm(`Tem certeza que deseja excluir o produto ID ${id}? (Esta ação não pode ser desfeita e NÃO será salva permanentemente ainda)`)) {
            const productArray = allProductSources[source];
            const productIndex = productArray.findIndex(p => p.id === id);
            
            if (productIndex > -1) {
                productArray.splice(productIndex, 1);
                renderProductsTable();
                alert('Produto excluído com sucesso (da memória)!');
            }
        }
    }

    // Evento de submit do formulário (Salvar ou Adicionar)
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = productIdInput.value ? parseInt(productIdInput.value) : null;
        const source = productSourceInput.value;

        const productData = {
            title: titleInput.value,
            price: priceInput.value,
            icon: iconInput.value,
            category: categoryInput.value || undefined,
            brand: brandInput.value || undefined
        };

        if (id && source) { // Modo Edição
            const productArray = allProductSources[source];
            const productIndex = productArray.findIndex(p => p.id === id);
            if (productIndex > -1) {
                // Mantém o ID original, mas atualiza o resto
                productArray[productIndex] = { ...productArray[productIndex], ...productData };
                alert('Produto atualizado com sucesso (em memória)!');
            }
        } else { // Modo Adição (Simples, adiciona ao primeiro array como exemplo)
            const newId = Math.max(...Object.values(allProductSources).flat().map(p => p.id)) + 1;
            productData.id = newId;
            
            // Adiciona o novo produto ao array de "Máquinas" como padrão
            // (Você pode criar um <select> no form para escolher onde adicionar)
            masterProductsMaquinas.push(productData);
            alert(`Novo produto adicionado com ID ${newId} (em memória)!`);
        }

        renderProductsTable();
        clearForm();
    });

    // Evento para o botão de limpar
    clearFormBtn.addEventListener('click', clearForm);

    // Renderização inicial da tabela
    renderProductsTable();
});