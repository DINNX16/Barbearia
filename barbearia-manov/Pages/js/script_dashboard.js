document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DE PROTEÇÃO DA PÁGINA ---
    // Esta parte do código roda assim que a página carrega
    const usuarioEstaLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioEstaLogado) {
        // Se o item 'usuarioLogado' não existir, o usuário não fez login.
        alert('Você precisa fazer login para acessar esta página.');
        // Expulsa o usuário, mandando-o de volta para a tela de login.
        window.location.href = 'barbearia-manov\Pages\login.html';
    }


    // --- 2. LÓGICA DO BOTÃO DE LOGOUT ---
    const logoutButton = document.getElementById('logoutButton');

    logoutButton.addEventListener('click', () => {
        // Remove o item que mantém o usuário "logado"
        localStorage.removeItem('usuarioLogado');

        // Avisa o usuário e redireciona para a página de login
        alert('Você saiu da sua conta.');
        window.location.href = 'barbearia-manov\Pages\login.html';
    });
});