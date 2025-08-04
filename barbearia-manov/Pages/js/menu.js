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

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('avaliacoes-destaque-container');
  if (!container) return;

  /**
   * Pega um array, embaralha seus itens e retorna uma nova cópia.
   */
  function embaralharArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
  }

  /**
   * Cria o HTML para um card de avaliação.
   */
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
    // 1. Busca todos os feedbacks da API
    const response = await fetch('/api/feedbacks');
    const todosOsFeedbacks = await response.json();

    // 2. Filtra apenas os feedbacks com nota 3 ou maior
    const feedbacksFiltrados = todosOsFeedbacks.filter(fb => fb.nota && fb.nota >= 3);

    // 3. Embaralha a lista filtrada
    const feedbacksEmbaralhados = embaralharArray(feedbacksFiltrados);

    // 4. Pega os 2 primeiros da lista embaralhada
    const feedbacksEmDestaque = feedbacksEmbaralhados.slice(0, 2);

    // 5. Renderiza os cards na página
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