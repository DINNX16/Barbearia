// js/carrinho.js

document.addEventListener('DOMContentLoaded', () => {
    const listaItensUI = document.getElementById('lista-itens-carrinho');
    const subtotalUI = document.getElementById('subtotal-valor');
    const totalUI = document.getElementById('total-valor');
    const qtdeItensUI = document.getElementById('qtde-itens');
    const btnFinalizar = document.getElementById('finalizar-compra');

    let carrinho = [];

    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinhoManov');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        if (carrinho.length === 0) {
            listaItensUI.innerHTML = '<p class="carrinho-vazio">Seu carrinho está vazio.</p>';
        } else {
            listaItensUI.innerHTML = ''; // Limpa a lista
            carrinho.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-carrinho';
                itemDiv.dataset.id = item.id;

                itemDiv.innerHTML = `
                    <img src="${item.imagem || 'assets/produto-placeholder.png'}" alt="${item.name}">
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <span class="item-preco">R$ ${(item.price / 100).toFixed(2)}</span>
                    </div>
                    <div class="item-quantidade">
                        <input type="number" value="${item.quantity}" min="1" class="quantidade-input">
                    </div>
                    <div class="item-preco-total">
                        <strong>R$ ${((item.price * item.quantity) / 100).toFixed(2)}</strong>
                    </div>
                    <button class="item-remover">&times;</button>
                `;
                listaItensUI.appendChild(itemDiv);
            });
        }
        atualizarResumo();
    }
    
    function atualizarResumo() {
        const subtotal = carrinho.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const totalItens = carrinho.reduce((acc, item) => acc + item.quantity, 0);

        subtotalUI.textContent = `R$ ${(subtotal / 100).toFixed(2)}`;
        totalUI.textContent = `R$ ${(subtotal / 100).toFixed(2)}`; // Adicionar frete ou taxas aqui se necessário
        qtdeItensUI.textContent = totalItens;
    }

    function salvarCarrinho() {
        localStorage.setItem('carrinhoManov', JSON.stringify(carrinho));
    }

    listaItensUI.addEventListener('click', (event) => {
        // Encontra o elemento 'item-carrinho' pai do elemento clicado
        const itemAlvo = event.target.closest('.item-carrinho');
        if (!itemAlvo) return;

        const itemId = itemAlvo.dataset.id;
        
        // Se o botão de remover foi clicado
        if (event.target.classList.contains('item-remover')) {
            carrinho = carrinho.filter(item => item.id !== itemId);
            salvarCarrinho();
            renderizarCarrinho();
        }
    });
    
    listaItensUI.addEventListener('change', (event) => {
        // Encontra o elemento 'item-carrinho' pai do input que mudou
        const itemAlvo = event.target.closest('.item-carrinho');
        if (!itemAlvo || !event.target.classList.contains('quantidade-input')) return;

        const itemId = itemAlvo.dataset.id;
        const novaQuantidade = parseInt(event.target.value);
        
        const itemNoCarrinho = carrinho.find(item => item.id === itemId);

        if (itemNoCarrinho && novaQuantidade > 0) {
            itemNoCarrinho.quantity = novaQuantidade;
            salvarCarrinho();
            renderizarCarrinho();
        }
    });

    // Função de finalizar compra (comunicação com Stripe)
    btnFinalizar.addEventListener('click', () => {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }

        const token = localStorage.getItem('seuTokenJWT');
        if (!token) {
            alert('Você precisa estar logado para finalizar a compra!');
            window.location.href = 'login.html'; // Redireciona para o login
            return;
        }

        fetch('http://localhost:3000/api/pagamentos/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: carrinho })
        })
        .then(res => res.json())
        .then(data => {
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Erro ao iniciar pagamento: ' + (data.error || ''));
            }
        })
        .catch(error => console.error('Erro:', error));
    });

    // Carrega o carrinho assim que a página é aberta
    carregarCarrinho();
});