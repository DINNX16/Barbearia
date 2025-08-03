function openNav() {
  document.getElementById("myNav").style.width = "50%";
}

function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

// NOVO SCRIPT PARA MOSTRAR/ESCONDER CONTEÚDO
function showContent(sectionId) {
  // Esconde todas as seções de conteúdo
  var sections = document.querySelectorAll(".content-section");
  sections.forEach(function (section) {
    section.classList.remove("active");
  });

  // Mostra a seção clicada
  var activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add("active");
  }
}

// ANIMAÇÃO DE LOADING SIMPLES
let contador = 3;

function iniciarLoading() {
  let contadorEl = document.getElementById("contador");

  let intervalo = setInterval(() => {
    contador--;
    contadorEl.textContent = contador;

    if (contador <= 0) {
      clearInterval(intervalo);
      // Esconde loading
      document.getElementById("loading").style.opacity = "0";
      setTimeout(() => {
        document.getElementById("loading").style.display = "none";
        document.getElementById("conteudo").classList.add("mostrar");
      }, 500);
    }
  }, 1000);
}
// --- FIM DO SCRIPT DE LOADING ---

document.addEventListener("DOMContentLoaded", function () {
  // =================================================================
  // LÓGICA DE ROTEAMENTO PARA MOSTRAR SEÇÕES (ex: /fotos-cortes.html#barbas)
  // =================================================================
  function handleSectionDisplay() {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      showContent(sectionId);
    } else {
      // Só mostra 'cortes' como padrão se o elemento existir
      if (document.getElementById("cortes")) {
        showContent("cortes");
      }
    }
  }



  // Executa a lógica de roteamento assim que a página carrega
  handleSectionDisplay();
  // E também quando a âncora (#) da URL muda
  window.addEventListener("hashchange", handleSectionDisplay);

  // =================================================================
  // LÓGICA DO LOADING DA PÁGINA
  // =================================================================
  // Apenas executa se o elemento de loading existir na página
  if (document.getElementById("loading")) {
    // Adia o início do loading para garantir que a página renderizou
    setTimeout(iniciarLoading, 100);
  }

  // =================================================================
  // LÓGICA DO CARROSSEL INFINITO
  // =================================================================
  const track = document.querySelector(".carousel-track");
  const nextButton = document.querySelector(".next-button");
  const prevButton = document.querySelector(".prev-button");

  // CORREÇÃO 1: Executa toda a lógica do carrossel APENAS
  // se os seus elementos existirem na página atual.
  if (track && nextButton && prevButton) {
    const cards = Array.from(track.children);
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      track.appendChild(clone);
    });

    let currentIndex = 0;
    let isMoving = false;

    function getCardWidth() {
      const cardStyle = window.getComputedStyle(cards[0]);
      const trackStyle = window.getComputedStyle(track);
      const cardWidth = cards[0].offsetWidth;
      const cardGap = parseFloat(trackStyle.gap) || 0;
      return cardWidth + cardGap;
    }

    function updatePosition(transition = true) {
      track.style.transition = transition
        ? "transform 0.6s ease-in-out"
        : "none";
      const cardWidth = getCardWidth();
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    function handleNext() {
      if (isMoving) return;
      isMoving = true;
      currentIndex++;
      updatePosition();
    }

    function handlePrev() {
      if (isMoving) return;
      isMoving = true;
      if (currentIndex === 0) {
        currentIndex = cards.length;
        updatePosition(false); // Move para o final sem animação
        setTimeout(() => {
          currentIndex--;
          updatePosition();
        }, 20);
      } else {
        currentIndex--;
        updatePosition();
      }
    }

    track.addEventListener("transitionend", () => {
      isMoving = false;
      if (currentIndex >= cards.length) {
        currentIndex = 0;
        updatePosition(false); // Salta para o início sem animação
      }
    });

    nextButton.addEventListener("click", handleNext);
    prevButton.addEventListener("click", handlePrev);

    window.addEventListener("resize", () => updatePosition(false));
  }
});


/**
 * Módulo de controle de acesso baseado no papel do usuário.
 */
document.addEventListener('DOMContentLoaded', function () {

  /**
   * Pega os dados do usuário logado do localStorage.
   * @returns {object | null} O objeto do usuário ou null se não houver ninguém logado.
   */
  function getUserData() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) {
      return null; // Ninguém logado
    }
    try {
      return JSON.parse(userString); // Converte a string de volta para objeto
    } catch (e) {
      console.error("Erro ao ler dados do usuário:", e);
      return null;
    }
  }

  function getUserData() {
    const userString = localStorage.getItem('currentUser');
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (e) {
      return null;
    }
  }

  /**
   * Verifica se o usuário logado NÃO é um cliente comum.
   * @returns {boolean} Verdadeiro se for proprietário ou funcionário.
   */
  function isPrivilegedUser() {
    const userData = getUserData();
    // A verificação agora inclui 'PROPRIETARIO' E 'FUNCIONARIO'
    return userData && (userData.role === 'PROPRIETARIO' || userData.role === 'FUNCIONARIO');
  }

  // --- Lógica Principal de Bloqueio ---
  if (isPrivilegedUser()) {
    console.log(`Usuário com papel especial (${getUserData().role}) detectado. Desabilitando funções de compra.`);
  }
    const buyButtons = document.querySelectorAll('.btn-comprar, .btn-buy');

    buyButtons.forEach(button => {
      button.disabled = true;
      button.style.backgroundColor = '#6c757d';
      button.style.cursor = 'not-allowed';
      button.textContent = 'Ação não permitida';
      button.setAttribute('title', 'Acesso de funcionário/proprietário não permite compras.');
    });
  // --- Lógica Principal ---
  // Se a função isOwner() retornar verdadeiro...
  if (isOwner()) {
    console.log("Usuário PROPRIETÁRIO detectado. Desabilitando funções de compra.");

    // Encontra TODOS os botões de compra pela classe '.btn-comprar'
    const buyButtons = document.querySelectorAll('.btn-comprar, .btn-buy');

    buyButtons.forEach(button => {
      button.disabled = true; // Desabilita o botão
      button.style.backgroundColor = '#6c757d'; // Muda a cor para cinza
      button.style.cursor = 'not-allowed'; // Muda o cursor do mouse
      button.textContent = 'Ação não permitida'; // Altera o texto do botão

      // Adiciona uma "dica" ao passar o mouse
      button.setAttribute('title', 'Proprietários não podem realizar compras.');
    });

    // Você pode adicionar outras lógicas aqui, como esconder o ícone do carrinho de compras
    const cartIcon = document.getElementById('cart-icon'); // Supondo que o ícone tenha este ID
    if (cartIcon) {
      cartIcon.style.display = 'none';
    }
  }
});