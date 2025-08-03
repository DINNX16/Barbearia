// /js/barbeiro-perfil.js

// --- Funções de Formatação ---
function formatPrice(price) {
    if (typeof price !== "number" && typeof price !== "string") return "N/A";
    const numericPrice = parseFloat(String(price).replace(",", "."));
    if (isNaN(numericPrice)) return "N/A";
    return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
}

// --- Funções para Simular Chamadas de API ---

// Carrega os dados do perfil do barbeiro/proprietário
async function mockFetchBarberProfile() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                nome: "Sr. Manóv",
                email: "admin@barbeariamanov.com",
                fotoUrl: "https://i.pinimg.com/736x/b4/73/34/b4733443a216c5a5248e7751a14a6822.jpg",
            });
        }, 500);
    });
}

// Carrega estatísticas do negócio
async function mockFetchBusinessStats() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                clientesAtivos: 124,
                servicosEsteMes: 89,
                faturamentoMes: 7560.50,
                proximoAniversariante: "João Silva"
            });
        }, 800);
    });
}

// Simula busca no "banco de dados"
async function mockFetchDatabaseSummary(dataType) {
    await new Promise(res => setTimeout(res, 600));
    const allProducts = [{ id: 1, title: "Pomada Clássica", price: "45.90", category: "pomadas", brand: "QOD" }, { id: 2, title: "Óleo para Barba", price: "35.90", category: "oleos", brand: "TrueMan" }, { id: 3, title: "Pente de Madeira", price: "19.90", category: "acessorios", brand: "Uppercut" }, { id: 7, title: "Máquina Profissional", price: "299.90", category: "ferramentas", brand: "QOD" }, { id: 8, title: "Navalhete de Aço", price: "55.00", category: "ferramentas", brand: "Uppercut" }, { id: 13, title: "Loção Pós-Barba", price: "42.50", category: "cosmeticos", brand: "N/A" }];
    const allClients = [{ id: 101, nome: "José Bezerra", email: "jose.bezerra@email.com", ultimo_servico: "Corte Social" }, { id: 102, nome: "Carlos Almeida", email: "carlos.a@email.com", ultimo_servico: "Barba Detalhada" }, { id: 103, nome: "Pedro Martins", email: "pedrom@email.com", ultimo_servico: "Corte Degradê" }];
    const allServices = [{ id: 201, nome: "Corte Social", preco: "50.00", duracao_min: 30 }, { id: 202, nome: "Barba Detalhada", preco: "40.00", duracao_min: 25 }, { id: 203, nome: "Corte + Barba", preco: "85.00", duracao_min: 55 }];
    if (dataType === 'products') return allProducts;
    if (dataType === 'clients') return allClients;
    if (dataType === 'services') return allServices;
    return [];
}

// Simula busca de dados de faturamento para os gráficos
async function mockFetchBillingData(period) {
    await new Promise(res => setTimeout(res, 500));
    const today = new Date();
    const currentMonthName = today.toLocaleString('pt-BR', { month: 'long' });
    const dataCurrentMonth = { labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], values: [1850.50, 2100.00, 1980.75, 2540.25], label: `Faturamento de ${currentMonthName}` };
    const dataPastMonth1 = { labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], values: [1700.00, 1950.50, 2050.25, 2200.00], label: "Faturamento do Mês Passado" };
    const dataPastMonth2 = { labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"], values: [1650.75, 1800.00, 1750.50, 2100.75], label: "Faturamento de 2 Meses Atrás" };
    if (period === 'current') return dataCurrentMonth;
    if (period === 'past-1') return dataPastMonth1;
    if (period === 'past-2') return dataPastMonth2;
    return dataCurrentMonth;
}


// --- Funções para Renderizar (Exibir) os dados no HTML ---

function renderBarberProfile(userData) {
    document.getElementById("profile-pic-display").src = userData.fotoUrl || "https://via.placeholder.com/150";
    document.getElementById("profile-pic-display").alt = `Foto de ${userData.nome}`;
    document.getElementById("user-name-display").textContent = userData.nome || "Nome não informado";
    document.getElementById("user-email-display").textContent = userData.email || "Email não informado";
}

function renderStats(stats) {
    const statsListElement = document.getElementById("estatisticas-list");
    if (!stats) {
        statsListElement.innerHTML = "<p>Não foi possível carregar as estatísticas.</p>";
        return;
    }
    statsListElement.innerHTML = `
        <div class="management-link"><i class="fas fa-users"></i><span>Clientes Ativos: <strong>${stats.clientesAtivos}</strong></span></div>
        <div class="management-link"><i class="fas fa-calendar-check"></i><span>Serviços este Mês: <strong>${stats.servicosEsteMes}</strong></span></div>
        <a href="#" id="open-billing-modal" class="management-link">
            <i class="fas fa-wallet"></i><span>Faturamento do Mês: <strong>${formatPrice(stats.faturamentoMes)}</strong></span>
        </a>
        <div class="management-link"><i class="fas fa-birthday-cake"></i><span>Próximo Aniversariante: <strong>${stats.proximoAniversariante}</strong></span></div>
    `;
}

function renderDataTable(data) {
    const container = document.getElementById('data-viewer-content');
    if (!data || data.length === 0) {
        container.innerHTML = `<p class="loading-message">Nenhum dado encontrado.</p>`;
        return;
    }
    const headers = Object.keys(data[0]);
    const tableHTML = `<table class="data-table"><thead><tr>${headers.map(header => `<th>${header.replace('_', ' ').toUpperCase()}</th>`).join('')}</tr></thead><tbody>${data.map(row => `<tr>${headers.map(header => `<td>${header.includes('price') || header.includes('preco') ? formatPrice(row[header]) : row[header]}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    container.innerHTML = tableHTML;
}

let myBillingChart = null;
function drawBillingChart(chartData) {
    const ctx = document.getElementById('billing-chart').getContext('2d');
    if (myBillingChart) {
        myBillingChart.destroy();
    }
    myBillingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: chartData.label,
                data: chartData.values,
                backgroundColor: 'rgba(219, 144, 46, 0.2)',
                borderColor: 'rgba(219, 144, 46, 1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true, ticks: { callback: (value) => 'R$ ' + value.toLocaleString('pt-BR') } } },
            plugins: { tooltip: { callbacks: { label: (context) => (context.dataset.label || '') + ': ' + formatPrice(context.parsed.y) } } }
        }
    });
}


// --- Função Principal e Inicialização ---

async function loadInitialData() {
    try {
        const [userData, statsData] = await Promise.all([
            mockFetchBarberProfile(),
            mockFetchBusinessStats()
        ]);
        renderBarberProfile(userData);
        renderStats(statsData);
    } catch (error) {
        console.error("Erro ao carregar dados do perfil do barbeiro:", error);
        document.getElementById("user-name-display").textContent = "Erro ao carregar";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
    document.getElementById("current-year").textContent = new Date().getFullYear();

    document.querySelector(".edit-profile").addEventListener("click", () => {
        alert("Funcionalidade de edição de perfil será implementada aqui!");
    });

    const tabButtons = document.querySelectorAll('.tab-btn');
    const dataContainer = document.getElementById('data-viewer-content');

    async function handleTabClick(event) {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        const clickedButton = event.currentTarget;
        clickedButton.classList.add('active');
        const dataType = clickedButton.dataset.type;
        dataContainer.innerHTML = `<p class="loading-message">Carregando dados de ${dataType}...</p>`;
        try {
            const data = await mockFetchDatabaseSummary(dataType);
            renderDataTable(data);
        } catch (error) {
            dataContainer.innerHTML = `<p class="loading-message">Erro ao carregar os dados.</p>`;
        }
    }
    tabButtons.forEach(button => button.addEventListener('click', handleTabClick));
    if (tabButtons.length > 0) tabButtons[0].click();

    const modal = document.getElementById('billing-modal');
    const closeModalBtn = document.getElementById('close-billing-modal');
    const chartControlButtons = document.querySelectorAll('.chart-tab-btn');

    async function openModal() {
        if (!modal) return;
        modal.style.display = 'flex';
        const initialData = await mockFetchBillingData('current');
        drawBillingChart(initialData);
    }

    function closeModal() {
        if (modal) modal.style.display = 'none';
    }

    document.body.addEventListener('click', function(event) {
        if (event.target.closest('#open-billing-modal')) {
            event.preventDefault();
            openModal();
        }
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    chartControlButtons.forEach(button => {
        button.addEventListener('click', async function() {
            chartControlButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const period = this.dataset.month;
            const newData = await mockFetchBillingData(period);
            drawBillingChart(newData);
        });
    });
});

//ISSO É PRA QUANDO A API TIVER PRONTA !!




//async function fetchDatabaseSummary(dataType) { // Renomeamos para refletir a realidade
    // O `dataType` que vem do botão ('products', 'clients') vira o endpoint da API
//    const endpoint = `/api/v1/${dataType}`; 
    
//    try {
 //       const response = await fetch(endpoint);
 //       if (!response.ok) {
 //           throw new Error(`Erro na API: ${response.statusText}//`);
  //      }
  //      const data = await response.json();
  //      return data;
  //  } catch (error) {
  //      console.error(`Falha ao buscar dados de ${endpoint}:`, //error);
  //      return []; // Retorna um array vazio em caso de erro para //não quebrar a tela
  //  }
//}