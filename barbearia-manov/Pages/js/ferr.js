     // --- FUNÇÕES DE MENU E NAVEGAÇÃO ---
      function openNav() {
        document.getElementById("myNav").style.width = "50%";
      }

      function closeNav() {
        document.getElementById("myNav").style.width = "0%";
      }

      function performSearch() {
        const searchTerm = document.querySelector(".search-header input").value;
        if (searchTerm.trim()) {
          alert(`Buscando por: ${searchTerm}`);
        }
      }

      // --- BANCO DE DADOS DE PRODUTOS ---
      const masterProductsMaquinas = [
        {
          id: 1,
          title: "Wahl Magic Clip Cordless",
          price: "699.90",
          category: "maquinas-corte",
          brand: "Wahl",
          icon: "⚡️",
        },
        {
          id: 2,
          title: "Andis Slimline Pro Li",
          price: "489.90",
          category: "maquinas-acabamento",
          brand: "Andis",
          icon: "✒️",
        },
        {
          id: 3,
          title: "BabylissPRO GoldFX",
          price: "1299.90",
          category: "maquinas-corte",
          brand: "BabylissPRO",
          icon: "✨",
        },
        {
          id: 4,
          title: "Wahl Senior Cordless",
          price: "899.00",
          category: "maquinas-corte",
          brand: "Wahl",
          icon: "🔌",
        },
        {
          id: 5,
          title: "Andis Master Cordless",
          price: "1100.00",
          category: "maquinas-corte",
          brand: "Andis",
          icon: "🔥",
        },
        {
          id: 6,
          title: "BabylissPRO Lo-PROFX",
          price: "950.00",
          category: "maquinas-acabamento",
          brand: "BabylissPRO",
          icon: "✍️",
        },
      ];

      const masterProductsLaminas = [
        {
          id: 7,
          title: "Tesoura Jaguar Fio Laser 6.0",
          price: "350.00",
          category: "tesouras",
          brand: "Jaguar",
          icon: "✂️",
        },
        {
          id: 8,
          title: "Navalhete de Aço Inox",
          price: "55.00",
          category: "laminas",
          brand: "Wahl",
          icon: "🔪",
        },
        {
          id: 9,
          title: "Tesoura de Desbaste Jaguar",
          price: "320.00",
          category: "tesouras",
          brand: "Jaguar",
          icon: "🌿",
        },
        {
          id: 10,
          title: "Lâmina de Cerâmica (Magic Clip)",
          price: "120.00",
          category: "laminas",
          brand: "Wahl",
          icon: "❄️",
        },
        {
          id: 11,
          title: "Navalhete Profissional Gold",
          price: "89.90",
          category: "laminas",
          brand: "BabylissPRO",
          icon: "🌟",
        },
        {
          id: 12,
          title: "Tesoura Fio Navalha 7.0",
          price: "450.00",
          category: "tesouras",
          brand: "Andis",
          icon: "💎",
        },
      ];

      const tableProducts = [
        {
          id: 13,
          title: "Kit Pentes Premium Wahl",
          price: "150.00",
          icon: "📊",
        },
        {
          id: 14,
          title: "Óleo Lubrificante",
          price: "25.00",
          icon: "💧",
        },
        {
          id: 15,
          title: "Escova de Disfarce",
          price: "35.00",
          icon: "🖌️",
        },
        {
          id: 16,
          title: "Espanador de Cerdas Macias",
          price: "45.00",
          icon: "💨",
        },
        {
          id: 17,
          title: "Capa de Corte Premium",
          price: "99.00",
          icon: "👕",
        },
        {
          id: 18,
          title: "Kit Completo BabylissPRO",
          price: "2500.00",
          icon: "💼",
        },
        {
          id: 19,
          title: "Bancada Auxiliar de Aço",
          price: "350.00",
          icon: "🔩",
        },
        {
          id: 20,
          title: "Esterilizador UV para Ferramentas",
          price: "299.00",
          icon: "💡",
        },
      ];

      // --- VARIÁVEIS DE CONTROLE ---
      let allCarousels = [
        [...masterProductsMaquinas],
        [...masterProductsLaminas],
      ];
      let currentSlides = [0, 0];

      // --- FUNÇÕES DE RENDERIZAÇÃO ---
      function createProductCard(product) {
        return `
                <div class="product-card">
                  <div class="product-image">${product.icon}</div>
                  <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-price">
                      <span class="price">R$ ${parseFloat(product.price)
                        .toFixed(2)
                        .replace(".", ",")}</span>
                      <button class="btn-buy">Comprar</button>
                    </div>
                  </div>
                </div>`;
      }

      // --- LÓGICA DO CARROSSEL ---
      function initCarousel(carouselIndex) {
        const products = allCarousels[carouselIndex];
        const track = document.getElementById(
          `carousel-track-${carouselIndex + 1}`
        );
        if (track) {
          track.innerHTML =
            products.length > 0
              ? products.map(createProductCard).join("")
              : '<p style="padding: 20px; text-align: center; width: 100%;">Nenhum produto aqui.</p>';
          currentSlides[carouselIndex] = 0;
          track.style.transform = "translateX(0px)";
        }
      }

      function moveSlide(direction, carouselIndex) {
        const track = document.getElementById(
          `carousel-track-${carouselIndex + 1}`
        );
        const products = allCarousels[carouselIndex];
        const cardWidth = 300;
        const visibleCards = Math.floor(
          track.parentElement.offsetWidth / cardWidth
        );
        const maxSlides = Math.max(0, products.length - visibleCards);
        let newIndex = currentSlides[carouselIndex] + direction;
        if (newIndex < 0) {
          newIndex = 0;
        } else if (newIndex > maxSlides) {
          newIndex = maxSlides;
        }
        currentSlides[carouselIndex] = newIndex;
        track.style.transform = `translateX(-${newIndex * cardWidth}px)`;
      }

      // --- LÓGICA DOS FILTROS ---
      function applyFilters() {
        const minPrice =
          parseFloat(document.getElementById("minPrice").value) || 0;
        const maxPrice =
          parseFloat(document.getElementById("maxPrice").value) || Infinity;
        const selectedCategories = Array.from(
          document.querySelectorAll('input[name="category"]:checked')
        ).map((el) => el.value);
        const selectedBrands = Array.from(
          document.querySelectorAll('input[name="brand"]:checked')
        ).map((el) => el.value);

        const filterFunction = (product) => {
          const price = parseFloat(product.price);
          const categoryMatch =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category);
          const brandMatch =
            selectedBrands.length === 0 ||
            !product.brand ||
            selectedBrands.includes(product.brand);
          const priceMatch = price >= minPrice && price <= maxPrice;
          return categoryMatch && brandMatch && priceMatch;
        };

        allCarousels[0] = masterProductsMaquinas.filter(filterFunction);
        allCarousels[1] = masterProductsLaminas.filter(filterFunction);
        initCarousel(0);
        initCarousel(1);
        updateResults();
      }

      function clearFilters() {
        document
          .querySelectorAll('input[type="checkbox"], input[type="radio"]')
          .forEach((el) => (el.checked = false));
        document.getElementById("minPrice").value = "";
        document.getElementById("maxPrice").value = "";
        allCarousels = [
          [...masterProductsMaquinas],
          [...masterProductsLaminas],
        ];
        initCarousel(0);
        initCarousel(1);
        updateResults();
      }

      function updateResults() {
        const totalFound = allCarousels.flat().length;
        document.getElementById(
          "resultsCount"
        ).innerHTML = `🎯 <strong>${totalFound}</strong> produtos encontrados`;
        const carouselsWrapper = document.getElementById("carousels-wrapper");
        const noResultsDiv = document.getElementById("no-results");
        carouselsWrapper.style.display = totalFound > 0 ? "block" : "none";
        noResultsDiv.style.display = totalFound > 0 ? "none" : "block";
      }

      // --- LÓGICA DA SEÇÃO EXPANSÍVEL ---
      function initExpandableTable() {
        const wrapper = document.getElementById("expandable-wrapper-1");
        if (!wrapper) return;
        const gridHTML = `
              <div class="expandable-product-grid">
                ${tableProducts.map(createProductCard).join("")}
              </div>
            `;
        wrapper.innerHTML = gridHTML;
      }

      function toggleExpand(containerId, buttonEl) {
        const container = document.getElementById(containerId);
        const buttonText = buttonEl.querySelector("span");
        container.classList.toggle("expanded");
        if (container.classList.contains("expanded")) {
          buttonText.textContent = "Recolher";
        } else {
          buttonText.textContent = "Expandir";
        }
      }

      // --- INICIALIZAÇÃO E EVENTOS ---
      document.addEventListener("DOMContentLoaded", function () {
        initCarousel(0);
        initCarousel(1);
        initExpandableTable();
        updateResults();
        document
          .querySelector(".search-header input")
          .addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
              performSearch();
            }
          });
        document
          .querySelector(".btn-busca")
          .addEventListener("click", performSearch);
      });