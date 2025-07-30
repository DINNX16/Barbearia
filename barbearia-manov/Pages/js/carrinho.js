// js/carrinho.js

// Executa o script quando o conteúdo da página estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERÊNCIAS AOS ELEMENTOS DO HTML ---
    const listaItensContainer = document.getElementById('lista-de-itens');
    const msgCarrinhoVazio = document.getElementById('carrinho-vazio-mensagem');
    const resumoSubtotalEl = document.getElementById('resumo-subtotal');
    const resumoQtdeEl = document.getElementById('resumo-qtde');
    const resumoTotalEl = document.getElementById('resumo-total');
    const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
    document.getElementById("current-year").textContent = new Date().getFullYear();

    let carrinho = []; // Array que guardará nossos itens

    // --- 2. FUNÇÕES PRINCIPAIS ---

    /**
     * Carrega os itens do carrinho salvos no localStorage do navegador.
     */
    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinhoManov'); // 'carrinhoManov' é a chave
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
        }
        renderizarCarrinho(); // Exibe os itens na tela
    }

    /**
     * Renderiza (desenha) os itens do carrinho e o resumo na tela.
     */
    function renderizarCarrinho() {
        // Limpa a lista de itens antes de redesenhar
        listaItensContainer.innerHTML = '';

        if (carrinho.length === 0) {
            msgCarrinhoVazio.style.display = 'block';
        } else {
            msgCarrinhoVazio.style.display = 'none';
            carrinho.forEach(item => {
                const itemHtml = `
                    <div class="carrinho-item" data-id="${item.id}">
                        <img src="${item.imagem || 'https://via.placeholder.com/80'}" alt="${item.name}" class="carrinho-item-img">
                        <div class="carrinho-item-info">
                            <h4>${item.name}</h4>
                            <span class="preco-unitario">R$ ${(item.price / 100).toFixed(2).replace('.', ',')}</span>
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

    /**
     * Calcula e exibe os totais no resumo do pedido.
     */
    function renderizarResumo() {
        let subtotal = 0;
        let totalItens = 0;

        carrinho.forEach(item => {
            subtotal += item.price * item.quantity;
            totalItens += item.quantity;
        });

        resumoSubtotalEl.textContent = `R$ ${(subtotal / 100).toFixed(2).replace('.', ',')}`;
        resumoTotalEl.textContent = `R$ ${(subtotal / 100).toFixed(2).replace('.', ',')}`;
        resumoQtdeEl.textContent = totalItens;
    }

    /**
     * Salva o estado atual do array 'carrinho' no localStorage.
     */
    function salvarCarrinho() {
        localStorage.setItem('carrinhoManov', JSON.stringify(carrinho));
    }

    /**
     * Lida com cliques e mudanças dentro da lista de itens (remover, alterar quantidade).
     */
    function handleItemInteraction(event) {
        const target = event.target;
        const itemContainer = target.closest('.carrinho-item');
        if (!itemContainer) return;

        const itemId = itemContainer.dataset.id;

        // Se o botão 'Remover' foi clicado
        if (target.classList.contains('btn-remover')) {
            carrinho = carrinho.filter(item => item.id !== itemId);
        }

        // Se a quantidade foi alterada
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

    /**
     * Inicia o processo de pagamento com o Stripe.
     */
    function finalizarCompra() {
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio.');
            return;
        }

        // Você precisará da lógica de autenticação aqui para pegar o token
        const token = localStorage.getItem('seuTokenJWT');
        if (!token) {
            alert("Você precisa estar logado para finalizar a compra.");
            // Opcional: redirecionar para a página de login
            // window.location.href = 'login.html';
            return;
        }
        
        console.log("Enviando para o Stripe:", carrinho);
        
        // Chamada para o seu backend criar a sessão do Stripe
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
                window.location.href = data.url; // Redireciona para o checkout do Stripe
            } else {
                alert('Ocorreu um erro ao processar seu pagamento. Tente novamente.');
                console.error('Erro do Stripe:', data.error);
            }
        })
        .catch(err => {
            console.error('Falha na comunicação com o servidor:', err);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão.');
        });
    }


    // --- 3. ADICIONANDO OS EVENT LISTENERS ---
    
    // Listener para interações na lista de itens (usando delegação de eventos)
    listaItensContainer.addEventListener('click', handleItemInteraction);
    listaItensContainer.addEventListener('change', handleItemInteraction);

    // Listener para o botão de finalizar compra
    btnFinalizarCompra.addEventListener('click', finalizarCompra);


    // --- 4. INICIALIZAÇÃO ---

    // Carrega o carrinho assim que a página é aberta.
    carregarCarrinho();
});