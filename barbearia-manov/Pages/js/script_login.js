document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', (event) => {
        // Impede o recarregamento da página
        event.preventDefault();

        // 1. Simulação de validação
        // Em um projeto real, você enviaria o email/senha para o servidor aqui.
        console.log('Tentativa de login...');

        // 2. Salva o estado de "logado" no armazenamento do navegador
        // Estamos salvando um item simples. Se ele existir, o usuário está "logado".
        localStorage.setItem('usuarioLogado', 'true'); 

        // 3. Informa o usuário e redireciona para a página protegida
        alert('Login realizado com sucesso! Bem-vindo!');
        window.location.href = '../Pages/logout.html';
    });
});