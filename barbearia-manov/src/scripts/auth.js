// ===== CONTROLE DE AUTENTICAÇÃO ===== //
let usuarioLogado = null;

// Função para verificar login ao carregar a página
function checkAuth() {
  usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

  if (usuarioLogado) {
    // Se logado, mostra botão Sair e esconde Login
    document.getElementById("logoutBtn").style.display = "block";
    document.getElementById("loginBtn").style.display = "none";

    // Opcional: Mostrar nome do usuário
    document.getElementById("nomeUsuario").textContent = usuarioLogado.nome;
  } else {
    // Se deslogado, faz o inverso
    document.getElementById("logoutBtn").style.display = "none";
    document.getElementById("loginBtn").style.display = "block";
  }
}

// Função de Logout
function logout() {
  // 1. Remove dados do usuário
  localStorage.removeItem("usuarioLogado");

  // 2. Atualiza a interface
  checkAuth();

  // 3. Mostra mensagem de sucesso
  alert("Logout efetuado com sucesso!");

  // 4. Redireciona (opcional)
  window.location.href = "main.html";
}

// Função simulada de Login (para teste)
function loginSimulado() {
  const usuarioFake = {
    nome: "João Silva",
    email: "joao@email.com",
    token: "abc123",
  };

  localStorage.setItem("usuarioLogado", JSON.stringify(usuarioFake));
  checkAuth();

  // Redireciona para a página principal após login
  window.location.href = "main.html"; // Altere para o nome da sua página principal
}

// Chama checkAuth quando a página carrega
document.addEventListener("DOMContentLoaded", checkAuth);
