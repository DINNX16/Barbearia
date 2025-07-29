// Espera todo o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

    // 1. SELECIONA OS LINKS DO MENU
    const loginLink = document.getElementById('loginMenuLink');
    const logoutLink = document.getElementById('logoutMenuLink');

    // 2. VERIFICA O ESTADO DE LOGIN
    // Pega o usuário do localStorage. Se não existir, o valor será 'null'.
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        // Se 'currentUser' EXISTE (usuário está logado)
        loginLink.style.display = 'none';    // Esconde o link de "Login"
        logoutLink.style.display = 'block';  // Mostra o link de "Logout"
    } else {
        // Se 'currentUser' NÃO EXISTE (usuário não está logado)
        loginLink.style.display = 'block';   // Mostra o link de "Login"
        logoutLink.style.display = 'none';   // Esconde o link de "Logout"
    }
});


// 3. DEFINE A FUNÇÃO DE LOGOUT
// Esta função é chamada pelo 'onclick' no seu HTML
function logout() {
    // Remove o usuário do localStorage
    localStorage.removeItem('currentUser');

    // Avisa o usuário e redireciona para a tela de login
    alert('Você saiu da sua conta.');
    window.location.href = '../Pages/login.html';
}

// Funções para abrir/fechar o menu overlay (se ainda não as tiver)
function openNav() {
  document.getElementById("myNav").style.width = "25%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}