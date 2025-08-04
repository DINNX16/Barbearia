// js/funcionario-perfil.js

const API_BASE_URL = 'http://localhost:3000'; // Ajuste se necessário

// =============================================================
// NOVA FUNÇÃO PARA BUSCAR DADOS REAIS DA API
// =============================================================
async function fetchEmployeeProfile() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        console.error('Token não encontrado, redirecionando para login.');
        window.location.href = 'login.html';
        throw new Error('Token de autenticação não encontrado.');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        console.error('Falha ao autenticar, redirecionando para login.');
        localStorage.clear();
        window.location.href = 'login.html';
        throw new Error('Falha na autenticação do token.');
    }

    const data = await response.json();
    return data.user; // Retorna o objeto 'user' completo e enriquecido
}


// --- Funções de Formatação (Ajustada) ---
function formatDate(dateString) {
    if (!dateString) return "Data indisponível";
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const time = `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}`;
    return `${day}/${month}/${year} às ${time}`;
}


// --- Funções de Renderização (Adaptadas para os dados reais) ---

function renderProfileInfo(data) {
    // Dados vêm de 'pessoa' e 'detalhesProfissional'
    document.getElementById('employee-pic-display').src = data.pessoa.foto_perfil || 'https://i.pravatar.cc/150';
    document.getElementById('employee-name-display').textContent = data.pessoa.nome_completo || 'Nome não informado';
    document.getElementById('employee-title-display').textContent = data.detalhesProfissional.especializacao || 'Profissional';
}

function renderVacationNotice(data) {
    // NOTA: O campo de aviso de férias não existe no banco de dados ainda.
    // Vamos deixar uma mensagem padrão por enquanto.
    document.getElementById('vacation-notice').textContent = "Sem avisos de férias no momento.";
}

function renderQualifications(data) {
    const container = document.getElementById('qualifications-content');
    if (!data.detalhesProfissional) {
        container.innerHTML = '<p>Nenhuma qualificação informada.</p>';
        return;
    }

    // Usamos os campos 'biografia' e 'especializacao' do banco
    const biografia = data.detalhesProfissional.biografia || 'Nenhuma biografia disponível.';
    const especializacao = data.detalhesProfissional.especializacao || 'Nenhuma especialização listada.';

    container.innerHTML = `
        <div class="qualifications-grid">
            <div class="qualification-item">
                <i class="fas fa-id-card"></i>
                <div><strong>Biografia:</strong><p style="margin: 5px 0 0 0;">${biografia}</p></div>
            </div>
            <div class="qualification-item">
                <i class="fas fa-graduation-cap"></i>
                <div><strong>Especializações:</strong><p style="margin: 5px 0 0 0;">${especializacao}</p></div>
            </div>
        </div>
    `;
}

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

    // O nome do cliente agora vem de `item.cliente.pessoa.nome_completo`
    listElement.innerHTML = appointments.map(item => `
        <div class="history-item">
            <div><strong>Cliente:</strong> ${item.cliente.pessoa.nome_completo}</div>
            <div><strong>Data:</strong> ${formatDate(item.data_hora_inicio)}</div>
            <div><strong>Status:</strong> ${item.status}</div>
        </div>
    `).join('');
}


// --- Lógica Principal (Orquestrador) ---
async function loadEmployeeProfile() {
    try {
        // Uma única chamada à API agora traz TODOS os dados que precisamos
        const data = await fetchEmployeeProfile();

        // Filtramos a lista de agendamentos recebida da API
        const upcomingAppointments = data.agendamentos.filter(ag => ['agendado', 'confirmado'].includes(ag.status.toLowerCase()));
        const historyAppointments = data.agendamentos.filter(ag => ['concluído', 'cancelado'].includes(ag.status.toLowerCase()));
        
        // Chamamos cada função de renderização com o objeto de dados completo ou a lista filtrada
        renderProfileInfo(data);
        renderVacationNotice(data);
        renderQualifications(data);
        renderAppointments(upcomingAppointments, 'upcoming-appointments-list', 'empty-upcoming');
        renderAppointments(historyAppointments, 'history-appointments-list', 'empty-history');

    } catch (error) {
        console.error("Erro ao carregar perfil do funcionário:", error);
        document.getElementById('employee-name-display').textContent = "Erro ao carregar dados.";
    }
}


// --- Inicialização ---
document.addEventListener("DOMContentLoaded", () => {
    loadEmployeeProfile();
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});