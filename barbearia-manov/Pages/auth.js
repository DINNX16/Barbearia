    
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

      // SCRIPT ORIGINAL DO CAROUSEL
      // NOVO SCRIPT PARA O CARROSSEL INFINITO
      document.addEventListener("DOMContentLoaded", function () {
        // Inicia o loading da página
        setTimeout(iniciarLoading, 500);

        // --- Início da lógica do Carrossel Infinito ---
        const track = document.querySelector(".carousel-track");
        const nextButton = document.querySelector(".next-button");
        const prevButton = document.querySelector(".prev-button");

        // Clona todos os cards para criar o efeito de loop
        const cards = Array.from(track.children);
        cards.forEach((card) => {
          const clone = card.cloneNode(true);
          track.appendChild(clone);
        });

        let currentIndex = 0;
        let isMoving = false; // Variável para evitar múltiplos cliques durante a transição

        function getCardWidth() {
          // Calcula a largura do card + o espaçamento (gap)
          const cardStyle = window.getComputedStyle(cards[0]);
          const trackStyle = window.getComputedStyle(track);
          const cardWidth = cards[0].offsetWidth;
          const cardGap = parseFloat(trackStyle.gap) || 0; // Pega o valor do 'gap' do CSS
          return cardWidth + cardGap;
        }

        function updatePosition() {
          // Atualiza a posição do carrossel com uma transição suave
          track.style.transition = "transform 0.6s ease-in-out";
          const cardWidth = getCardWidth();
          track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }

        function handleNext() {
          if (isMoving) return; // Se já estiver em movimento, ignora o clique
          isMoving = true;

          currentIndex++;
          updatePosition();
        }

        function handlePrev() {
          if (isMoving) return;
          isMoving = true;

          if (currentIndex === 0) {
            // Se estiver no primeiro item, salta para o final (no clone) sem animação
            const cardWidth = getCardWidth();
            track.style.transition = "none";
            currentIndex = cards.length; // Move para o início da seção de clones
            track.style.transform = `translateX(-${
              currentIndex * cardWidth
            }px)`;

            // Força o navegador a aplicar a mudança antes de continuar
            setTimeout(() => {
              currentIndex--;
              updatePosition();
            }, 20); // Um pequeno delay garante a transição correta
          } else {
            currentIndex--;
            updatePosition();
          }
        }

        // Adiciona o listener para o final da transição
        track.addEventListener("transitionend", () => {
          isMoving = false; // Permite o próximo clique

          // Verifica se chegou ao final da lista (no início dos clones)
          if (currentIndex >= cards.length) {
            // Salta de volta para o início real sem animação
            track.style.transition = "none";
            currentIndex = 0;
            const cardWidth = getCardWidth();
            track.style.transform = `translateX(-${
              currentIndex * cardWidth
            }px)`;
          }
        });

        // Adiciona os eventos de clique aos botões
        nextButton.addEventListener("click", handleNext);
        prevButton.addEventListener("click", handlePrev);

        // Atualiza a largura do card caso a janela seja redimensionada
        window.addEventListener("resize", () => {
          updatePosition();
        });
      });

      function openNav() {
        document.getElementById("myNav").style.width = "50%";
      }

      function closeNav() {
        document.getElementById("myNav").style.width = "0%";
      }
    