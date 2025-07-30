// /js/funcionario-perfil.js

// --- Funções de Formatação ---
function formatDate(dateString) {
    if (!dateString) return "Data indisponível";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const time = `${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}`;
    return `${day}/${month}/${year} às ${time}`;
}

// --- Simulação de API ---
// Esta função agora tem os dados corretos para "Eduardo M."
async function mockFetchEmployeeData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                id: 1, // ID do Eduardo M. na página de agenda
                name: "Eduardo M.", // Nome correspondente
                title: "Barbeiro Mestre e Fundador",
                avatarUrl: "https://i.pravatar.cc/150?u=eduardo.m",
                vacationNotice: "Sem avisos de férias no momento.",
                qualifications: {
                    instagram: "@eduardo.manov",
                    courses: [
                        "Mestre em barboterapia.",
                        "Especialista em cortes modernos e fade.",
                        "Visagismo e harmonização facial.",
                    ]
                },
                upcomingAppointments: [
                    { client: "Marcos Andrade", date: "2025-07-28T14:00:00" },
                    { client: "Lucas Ferraz", date: "2025-07-29T15:00:00" },
                ],
                historyAppointments: [
                    { client: "Daniel Siqueira", date: "2025-07-22T09:00:00" },
                    { client: "Fábio Ribeiro", date: "2025-07-21T16:30:00" },
                ]
            });
        }, 800);
    });
}

// --- Funções de Renderização (A parte que estava faltando) ---

// Renderiza o cabeçalho do perfil e o link da agenda
function renderProfileInfo(data) {
    document.getElementById('employee-pic-display').src = data.avatarUrl;
    document.getElementById('employee-name-display').textContent = data.name;
    document.getElementById('employee-title-display').textContent = data.title;
    
    const agendaButton = document.querySelector('.btn-agenda');
    if (agendaButton) {
        agendaButton.href = `agenda.html?barbeiroId=${data.id}`;
    }
}

// Renderiza o aviso de férias
function renderVacationNotice(notice) {
    document.getElementById('vacation-notice').textContent = notice || "Sem avisos no momento.";
}

// Renderiza o card de qualificações
function renderQualifications(qualifications) {
    const container = document.getElementById('qualifications-content');
    const instagramLink = qualifications.instagram 
        ? `<a href="https://instagram.com/${qualifications.instagram.replace('@','')}" target="_blank">${qualifications.instagram}</a>`
        : 'Não informado';

    let coursesHTML = '<ul><li>Nenhum curso listado.</li></ul>';
    if (qualifications.courses && qualifications.courses.length > 0) {
        coursesHTML = `<ul>${qualifications.courses.map(course => `<li>${course}</li>`).join('')}</ul>`;
    }

    container.innerHTML = `
        <div class="qualifications-grid">
            <div class="qualification-item">
                <i class="fab fa-instagram"></i>
                <div><strong>Instagram:</strong> ${instagramLink}</div>
            </div>
            <div class="qualification-item">
                <i class="fas fa-graduation-cap"></i>
                <div><strong>Cursos e Certificados:</strong></div>
            </div>
        </div>
        ${coursesHTML} 
    `;
}

// Renderiza as listas de agendamentos (futuros e passados)
function renderAppointments(appointments, listId, emptyId) {
    const listElement = document.getElementById(listId);
    const emptyMessage = document.getElementById(emptyId);

    if (!listElement || !emptyMessage) return;

    if (!appointments || appointments.length === 0) {
        listElement.style.display = 'none';
        emptyMessage.style.display = 'block';
        return;
    }

    listElement.style.display = 'block';
    emptyMessage.style.display = 'none';

    listElement.innerHTML = appointments.map(item => `
        <div class="history-item">
            <div><strong>Cliente:</strong> ${item.client}</div>
            <div><strong>Data:</strong> ${formatDate(item.date)}</div>
        </div>
    `).join('');
}


// --- Lógica Principal ---
// Esta função orquestra tudo: busca os dados e chama as funções para renderizar
async function loadEmployeeProfile() {
    try {
        const data = await mockFetchEmployeeData();
        
        // Chama cada função de renderização com a parte correspondente dos dados
        renderProfileInfo(data);
        renderVacationNotice(data.vacationNotice);
        renderQualifications(data.qualifications);
        renderAppointments(data.upcomingAppointments, 'upcoming-appointments-list', 'empty-upcoming');
        renderAppointments(data.historyAppointments, 'history-appointments-list', 'empty-history');
    } catch (error) {
        console.error("Erro ao carregar perfil do funcionário:", error);
        // Coloca uma mensagem de erro em um dos cards se algo der errado
        document.getElementById('vacation-notice').textContent = "Erro ao carregar dados.";
    }
}

// --- Inicialização ---
// Garante que o código só rode depois que a página HTML estiver pronta
document.addEventListener("DOMContentLoaded", () => {
    loadEmployeeProfile();
    // Atualiza o ano no rodapé
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});