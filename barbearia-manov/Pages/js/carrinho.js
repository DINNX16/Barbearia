// js/carrinho.js

document.addEventListener('DOMContentLoaded', () => {
    const listaItensContainer = document.getElementById('lista-de-itens');
    const msgCarrinhoVazio = document.getElementById('carrinho-vazio-mensagem');
    const resumoSubtotalEl = document.getElementById('resumo-subtotal');
    const resumoQtdeEl = document.getElementById('resumo-qtde');
    const resumoTotalEl = document.getElementById('resumo-total');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    document.getElementById("current-year").textContent = new Date().getFullYear();

    let carrinho = [];

    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinhoManov');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        listaItensContainer.innerHTML = '';
        if (carrinho.length === 0) {
            msgCarrinhoVazio.style.display = 'block';
            btnFinalizarCompra.disabled = true; // Desabilita o botão se o carrinho estiver vazio
            btnFinalizarCompra.style.cursor = 'not-allowed';
        } else {
            msgCarrinhoVazio.style.display = 'none';
            btnFinalizarCompra.disabled = false;
            btnFinalizarCompra.style.cursor = 'pointer';
            carrinho.forEach(item => {
                // No carrinho, o preço está em centavos. Convertemos para mostrar na tela.
                const precoEmReais = (item.price / 100).toFixed(2).replace('.', ',');
                const itemHtml = `
                    <div class="carrinho-item" data-id="${item.id}">
                        <img src="${item.imagem || 'https://via.placeholder.com/80'}" alt="${item.name}" class="carrinho-item-img">
                        <div class="carrinho-item-info">
                            <h4>${item.name}</h4>
                            <span class="preco-unitario">R$ ${precoEmReais}</span>
                        </div>
                        <div class="carrinho-item-controles">
                            <input type="number" class="quantidade-input" value="${item.quantity}" min="1">
                            <button class="btn-remover">Remover</button>
                        </div>
                    </div>
                `;
                listaItensContainer.innerHTML += itemHtml;
            });
        }
        renderizarResumo();
    }

    function renderizarResumo() {
        // O reduce calcula o total: (preço * quantidade) para cada item
        const subtotal = carrinho.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantity, 0);

        // Converte de centavos para reais para exibição
        resumoSubtotalEl.textContent = `R$ ${(subtotal / 100).toFixed(2).replace('.', ',')}`;
        resumoTotalEl.textContent = `R$ ${(subtotal / 100).toFixed(2).replace('.', ',')}`;
        resumoQtdeEl.textContent = totalItens;
    }

    function salvarCarrinho() {
        localStorage.setItem('carrinhoManov', JSON.stringify(carrinho));
        // Dispara um evento para que outros scripts (como o do ícone do carrinho) possam ouvir
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }

    function handleItemInteraction(event) {
        const target = event.target;
        const itemContainer = target.closest('.carrinho-item');
        if (!itemContainer) return;

        const itemId = itemContainer.dataset.id;
        
        if (target.classList.contains('btn-remover')) {
            carrinho = carrinho.filter(item => item.id !== itemId);
        }

        if (target.classList.contains('quantidade-input')) {
            const novaQuantidade = parseInt(target.value);
            const itemParaAtualizar = carrinho.find(item => item.id === itemId);
            if (itemParaAtualizar && novaQuantidade > 0) {
                itemParaAtualizar.quantity = novaQuantidade;
            }
        }
        salvarCarrinho();
        renderizarCarrinho();
    }

    async function finalizarCompra() {
        btnFinalizarCompra.disabled = true;
        btnFinalizarCompra.textContent = 'A processar...';

        // =======================================================
        // ALTERAÇÃO 1: Usando a chave correta para o token
        // =======================================================
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            alert("Você precisa estar logado para finalizar a compra.");
            btnFinalizarCompra.disabled = false;
            btnFinalizarCompra.textContent = 'Finalizar Compra';
            return;
        }

        // =======================================================
        // ALTERAÇÃO 2: Formatando os dados para o novo backend
        // =======================================================
        const itemsParaEnviar = carrinho.map(item => ({
            id: item.id,
            quantity: item.quantity,
        }));
        
        try {
            const response = await fetch('http://localhost:3000/api/pagamentos/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ items: itemsParaEnviar })
            });

            const data = await response.json();

            if (data.url) {
                // Limpa o carrinho antes de redirecionar para o pagamento
                localStorage.removeItem('carrinhoManov');
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Erro desconhecido do servidor.');
            }
        } catch (err) {
            console.error('Falha ao finalizar a compra:', err);
            alert('Não foi possível processar seu pagamento. Tente novamente.');
            btnFinalizarCompra.disabled = false;
            btnFinalizarCompra.textContent = 'Finalizar Compra';
        }
    }

    listaItensContainer.addEventListener('click', handleItemInteraction);
    listaItensContainer.addEventListener('change', handleItemInteraction);
    btnFinalizarCompra.addEventListener('click', finalizarCompra);

    carregarCarrinho();
});