// Espera todo o conteúdo da página carregar antes de rodar o script
document.addEventListener('DOMContentLoaded', () => {

  // 1. SELECIONA OS LINKS DO MENU
  const loginLink = document.getElementById('loginMenuLink');
  const logoutLink = document.getElementById('logoutMenuLink');
  
  // 2. VERIFICA O ESTADO DE LOGIN
  // A verificação agora prioriza o token, que é mais seguro.
  const token = localStorage.getItem('jwtToken');

  if (token) {
    // Se o TOKEN EXISTE (usuário está logado)
    loginLink.style.display = 'none';    // Esconde o link de "Login"
    logoutLink.style.display = 'block';  // Mostra o link de "Logout"
  } else {
    // Se o TOKEN NÃO EXISTE (usuário não está logado)
    loginLink.style.display = 'block';   // Mostra o link de "Login"
    logoutLink.style.display = 'none';   // Esconde o link de "Logout"
  }
});


// 3. FUNÇÃO DE LOGOUT CORRIGIDA
function logout() {
  // === A GRANDE MUDANÇA ESTÁ AQUI ===
  // Em vez de remover item por item, limpamos TUDO.
  // Isso garante que tanto 'currentUser' quanto 'jwtToken' sejam apagados.
  localStorage.clear();

  // Avisa o usuário e redireciona para a tela de login
  alert('Você saiu da sua conta.');
  // O caminho para a página de login no seu main.html parece ser direto
  window.location.href = 'login.html'; 
}

// Funções para abrir/fechar o menu overlay
function openNav() {
  document.getElementById("myNav").style.width = "25%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

// Lógica para carregar as avaliações (sem alterações)
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('avaliacoes-destaque-container');
  if (!container) return;

  function embaralharArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  function createAvaliacaoCard(feedback) {
    const nota = feedback.nota || 0;
    let estrelasHtml = '';
    for (let i = 1; i <= 5; i++) {
      estrelasHtml += `<span>${i <= nota ? '★' : '☆'}</span>`;
    }
    const nomeAvaliador = feedback.cliente?.pessoa?.nome_completo || 'Cliente Anônimo';
    const dataAvaliacao = new Date(feedback.data).toLocaleDateString('pt-BR');
    return `
            <div class="card-avaliacao">
                <div class="card-avaliacao-header">
                    <span class="nome-avaliador">${nomeAvaliador}</span>
                    <span class="data-avaliacao">${dataAvaliacao}</span>
                </div>
                <div class="estrelas-avaliacao" data-nota="${nota}">
                    ${estrelasHtml}
                </div>
                <p class="texto-avaliacao">${feedback.comentario || ''}</p>
            </div>
        `;
  }

  try {
    const response = await fetch('/api/feedbacks');
    const todosOsFeedbacks = await response.json();
    const feedbacksFiltrados = todosOsFeedbacks.filter(fb => fb.nota && fb.nota >= 3);
    const feedbacksEmbaralhados = embaralharArray(feedbacksFiltrados);
    const feedbacksEmDestaque = feedbacksEmbaralhados.slice(0, 2);

    if (feedbacksEmDestaque.length > 0) {
      container.innerHTML = feedbacksEmDestaque.map(createAvaliacaoCard).join('');
    } else {
      container.innerHTML = '<p style="text-align:center;">Ainda não temos avaliações suficientes para exibir.</p>';
    }

  } catch (error) {
    console.error("Erro ao carregar avaliações em destaque:", error);
    container.innerHTML = '<p style="text-align:center;">Não foi possível carregar as avaliações.</p>';
  }
});