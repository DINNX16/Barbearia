      // Função para formatar data (dd/mm/yyyy)
      function formatDate(dateString) {
        if (!dateString) return "Data indisponível";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses são 0-indexados
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

      // Função para formatar preço (R$ xx,xx)
      function formatPrice(price) {
        if (typeof price !== "number") return "Preço indisponível";
        return `R$ ${price.toFixed(2).replace(".", ",")}`;
      }

      // --- Funções para simular chamadas de API (substitua por chamadas reais `fetch`) ---
      async function mockFetchUserProfile() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              nome: "José Bezerra",
              email: "jose.bezerra@email.com",
              fotoUrl: "https://pm1.aminoapps.com/6688/88e84a41268e9a8d6a522254710158ab1e4cbb26_hq.jpg", // Imagem aleatória
            });
          }, 500);
        });
      }

      async function mockFetchUpcomingAppointments() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 1,
                servico: "Corte de Cabelo + Barba Detalhada",
                data: "2025-06-15T14:30:00",
                preco: 80.0,
                status: "Agendado",
              },
              {
                id: 2,
                servico: "Manutenção de Barba",
                data: "2025-06-30T10:00:00",
                preco: 45.0,
                status: "Agendado",
              },
            ]);
          }, 700);
        });
      }

      async function mockFetchLastServices() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 3,
                servico: "Corte Social",
                data: "2025-06-01T15:00:00",
                preco: 60.0,
                status: "Concluído",
              },
              {
                id: 4,
                servico: "Sobrancelha Masculina",
                data: "2025-05-20T11:30:00",
                preco: 25.0,
                status: "Concluído",
              },
              {
                id: 5,
                servico: "Corte + Hidratação Profunda",
                data: "2025-05-05T16:00:00",
                preco: 90.0,
                status: "Concluído",
              },
            ]);
          }, 600);
        });
      }

      async function mockFetchAppointmentsHistory() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 6,
                servico: "Corte Degradê",
                data: "2025-04-15T14:00:00",
                preco: 65.0,
                status: "Concluído",
              },
              {
                id: 7,
                servico: "Barba Completa Clássica",
                data: "2025-04-01T10:30:00",
                preco: 40.0,
                status: "Concluído",
              },
              {
                id: 8,
                servico: "Corte + Barba (Cancelado)",
                data: "2025-03-20T13:00:00",
                preco: 80.0,
                status: "Cancelado",
              },
            ]);
          }, 800);
        });
      }

      async function mockFetchPurchasesHistory() {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve([
              {
                id: 101,
                produto: "Kit Barber - Pomada Modeladora + Pente de Madeira",
                data: "2025-06-10",
                preco: 120.0,
                status: "Entregue",
              },
              {
                id: 102,
                produto: "Navalhete Profissional Aço Inox",
                data: "2025-05-25",
                preco: 85.0,
                status: "Entregue",
              },
            ]);
            // Para testar a mensagem de "nenhuma compra":
            // resolve([]);
          }, 900);
        });
      }

      // --- Funções para renderizar os dados no HTML ---

      function renderUserProfile(userData) {
        document.getElementById("profile-pic-display").src =
          userData.fotoUrl || "https://via.placeholder.com/150";
        document.getElementById(
          "profile-pic-display"
        ).alt = `Foto de ${userData.nome}`;
        document.getElementById("user-name-display").textContent =
          userData.nome || "Nome não informado";
        document.getElementById("user-email-display").textContent =
          userData.email || "Email não informado";
      }

      function getStatusClass(status) {
        if (!status) return "";
        const s = status.toLowerCase();
        if (s === "agendado" || s === "upcoming") return "status-upcoming";
        if (s === "concluído" || s === "completed" || s === "entregue")
          return "status-completed";
        if (s === "cancelado" || s === "cancelled") return "status-cancelled";
        return ""; // Classe padrão ou nenhuma
      }

      function renderGenericList(
        items,
        listElementId,
        emptyMessageElementId,
        itemHtmlGenerator
      ) {
        const listElement = document.getElementById(listElementId);
        const emptyMessageElement = document.getElementById(
          emptyMessageElementId
        );

        listElement.innerHTML = ""; // Limpa a lista

        if (items && items.length > 0) {
          emptyMessageElement.style.display = "none";
          items.forEach((item) => {
            listElement.innerHTML += itemHtmlGenerator(item);
          });
        } else {
          emptyMessageElement.style.display = "block";
        }
      }

      function createAppointmentsHtml(item) {
        const date = new Date(item.data);
        const time = `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`;
        return `
                <div class="history-item">
                    <div class="service-name">${item.servico}</div>
                    <div class="service-date">${formatDate(
                      item.data
                    )} - ${time}</div>
                    <div class="service-price">${formatPrice(item.preco)}</div>
                    <span class="status ${getStatusClass(item.status)}">${
          item.status
        }</span>
                </div>
            `;
      }

      function createPurchasesHtml(item) {
        return `
                <div class="history-item">
                    <div class="product-name">${item.produto}</div>
                    <div class="purchase-date">${formatDate(item.data)}</div>
                    <div class="purchase-price">${formatPrice(item.preco)}</div>
                    <span class="status ${getStatusClass(item.status)}">${
          item.status
        }</span>
                </div>
            `;
      }

      // --- Função principal para carregar todos os dados ---
      async function loadProfileData() {
        try {
          const userData = await mockFetchUserProfile();
          renderUserProfile(userData);

          const upcomingAppointments = await mockFetchUpcomingAppointments();
          renderGenericList(
            upcomingAppointments,
            "proximos-agendamentos-list",
            "empty-proximos-agendamentos",
            createAppointmentsHtml
          );

          const lastServices = await mockFetchLastServices();
          renderGenericList(
            lastServices,
            "ultimos-servicos-list",
            "empty-ultimos-servicos",
            createAppointmentsHtml
          );

          const appointmentsHistory = await mockFetchAppointmentsHistory();
          renderGenericList(
            appointmentsHistory,
            "historico-agendamentos-list",
            "empty-historico-agendamentos",
            createAppointmentsHtml
          );

          const purchasesHistory = await mockFetchPurchasesHistory();
          renderGenericList(
            purchasesHistory,
            "historico-compras-list",
            "empty-historico-compras",
            createPurchasesHtml
          );
        } catch (error) {
          console.error("Erro ao carregar dados do perfil:", error);
          // Aqui você pode exibir uma mensagem de erro mais amigável para o usuário em alguma parte da página
          document.getElementById("user-name-display").textContent =
            "Erro ao carregar";
          document.getElementById("user-email-display").textContent =
            "Tente novamente mais tarde.";
          // Poderia também mostrar as mensagens de erro em cada seção
          document.getElementById("empty-proximos-agendamentos").textContent =
            "Erro ao carregar agendamentos.";
          document.getElementById("empty-proximos-agendamentos").style.display =
            "block";
          // ... e para as outras seções
        }
      }

      // --- Inicialização ---
      document.addEventListener("DOMContentLoaded", () => {
        loadProfileData();
        document.getElementById("current-year").textContent =
          new Date().getFullYear();

        document
          .querySelector(".edit-profile")
          .addEventListener("click", function () {
            alert(
              "Funcionalidade de edição de perfil será implementada aqui! Você precisará criar um formulário e uma lógica para enviar os dados atualizados para sua API."
            );
          });
      });