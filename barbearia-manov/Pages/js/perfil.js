// js/perfil.js

const API_BASE_URL = 'http://localhost:3000';

// =============================================================
// FUNÇÕES DE FETCH (REAIS)
// =============================================================

// Busca os dados básicos do perfil (nome, email, etc.)
async function fetchUserProfile() {
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
  return data.user;
}

// NOVA FUNÇÃO: Busca o histórico de agendamentos da nova API
async function fetchAppointments() {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Token não encontrado.');

    const response = await fetch(`${API_BASE_URL}/api/agendamentos/meus-agendamentos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Falha ao buscar agendamentos.');
    return await response.json();
}

// NOVA FUNÇÃO: Busca o histórico de compras da nova API
async function fetchPurchases() {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('Token não encontrado.');

    const response = await fetch(`${API_BASE_URL}/api/pedidos/meus-pedidos`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('Falha ao buscar histórico de compras.');
    return await response.json();
}

// =============================================================
// FUNÇÕES DE RENDERIZAÇÃO E FORMATAÇÃO (sem grandes alterações)
// =============================================================

function formatDate(dateString) {
  if (!dateString) return "Data indisponível";
  const date = new Date(dateString);
  // Ajuste para garantir que a data seja exibida corretamente
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

function formatPrice(price) {
  if (typeof price !== "number" && typeof price !== "string") return "Preço indisponível";
  const numericPrice = parseFloat(String(price));
  return `R$ ${numericPrice.toFixed(2).replace(".", ",")}`;
}

function renderUserProfile(userData) {
  const nome = userData.pessoa ? userData.pessoa.nome_completo : 'Nome não disponível';
  const fotoUrl = userData.pessoa ? userData.pessoa.foto_perfil : null;
  document.getElementById("profile-pic-display").src = fotoUrl || "https://via.placeholder.com/150";
  document.getElementById("profile-pic-display").alt = `Foto de ${nome}`;
  document.getElementById("cover-photo-display").src = "https://i.pinimg.com/originals/1e/70/ae/1e70ae41273934d75891e49646b1a37a.jpg";
  document.getElementById("cover-photo-display").alt = `Foto de capa de ${nome}`;
  document.getElementById("user-name-display").textContent = nome;
  document.getElementById("user-email-display").textContent = userData.email || "Email não informado";
}

function getStatusClass(status) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "agendado" || s === "confirmado") return "status-upcoming";
  if (s === "concluído" || s === "completed" || s === "entregue") return "status-completed";
  if (s === "cancelado" || s === "cancelled") return "status-cancelled";
  return "";
}

function renderGenericList(items, listElementId, emptyMessageElementId, itemHtmlGenerator) {
  const listElement = document.getElementById(listElementId);
  const emptyMessageElement = document.getElementById(emptyMessageElementId);
  listElement.innerHTML = "";
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
  const time = `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`;
  return `
    <div class="history-item">
        <div class="service-name">${item.servico}</div>
        <div class="service-date">${formatDate(item.data)} - ${time}</div>
        <div class="service-price">${formatPrice(item.preco)}</div>
        <span class="status ${getStatusClass(item.status)}">${item.status}</span>
    </div>
  `;
}

function createPurchasesHtml(item) {
  return `
    <div class="history-item">
        <div class="product-name">${item.produto}</div>
        <div class="purchase-date">${formatDate(item.data)}</div>
        <div class="purchase-price">${formatPrice(item.preco)}</div>
        <span class="status ${getStatusClass(item.status)}">${item.status}</span>
    </div>
  `;
}


// =============================================================
// FUNÇÃO PRINCIPAL (ORQUESTRADOR)
// =============================================================

async function loadProfileData() {
  try {
    const [userData, allAppointments, purchasesHistory] = await Promise.all([
      fetchUserProfile(),
      fetchAppointments(),
      fetchPurchases(),
    ]);

    renderUserProfile(userData);
    renderGenericList(purchasesHistory, "historico-compras-list", "empty-historico-compras", createPurchasesHtml);

    // --- LÓGICA PARA SEPARAR OS AGENDAMENTOS ---
    const upcomingAppointments = allAppointments.filter(ag => ['agendado', 'confirmado'].includes(ag.status.toLowerCase()));
    const historyAppointments = allAppointments.filter(ag => ['concluído', 'cancelado'].includes(ag.status.toLowerCase()));
    const lastServices = [...historyAppointments].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 2); // Pega os 2 mais recentes do histórico

    renderGenericList(upcomingAppointments, "proximos-agendamentos-list", "empty-proximos-agendamentos", createAppointmentsHtml);
    renderGenericList(lastServices, "ultimos-servicos-list", "empty-ultimos-servicos", createAppointmentsHtml);
    renderGenericList(historyAppointments, "historico-agendamentos-list", "empty-historico-agendamentos", createAppointmentsHtml);
    
  } catch (error) {
    console.error("Não foi possível carregar todos os dados do perfil:", error.message);
    document.getElementById("user-name-display").textContent = "Erro ao carregar";
    document.getElementById("user-email-display").textContent = "Por favor, faça login novamente.";
  }
}

// --- INICIALIZAÇÃO E EVENT LISTENERS ---
document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // O resto da sua lógica de eventos (modal, cropper, etc.) pode continuar aqui
  // ...
});

// A lógica do cropper foi omitida por ser muito grande, mas deve ser mantida aqui.
// --- NOVO: LÓGICA DO MODAL E RECORTE DE IMAGEM ---

// Variáveis globais para o Cropper
let cropper = null;
let imageToCrop = document.getElementById("image-to-crop");
let cropModal = document.getElementById("crop-modal");
let currentCropType = null; // 'profile' ou 'cover'

// Função para abrir o modal de recorte
function openCropModal(imageFile, cropType, aspectRatio) {
  if (!imageFile) return;
  currentCropType = cropType;
  const reader = new FileReader();
  reader.onload = function (e) {
    imageToCrop.src = e.target.result;
    cropModal.style.display = "flex";
    if (cropper) {
      cropper.destroy();
    }
    cropper = new Cropper(imageToCrop, {
      aspectRatio: aspectRatio,
      viewMode: 1,
      responsive: true,
      background: false,
    });
  };
  reader.readAsDataURL(imageFile);
}

// Função para fechar o modal
function closeCropModal() {
  cropModal.style.display = "none";
  if (cropper) {
    cropper.destroy();
    cropper = null;
  }
}

// Função para lidar com o recorte e atualização da imagem
function handleCrop() {
  if (!cropper || !currentCropType) return;
  const canvas = cropper.getCroppedCanvas({
    width: currentCropType === "profile" ? 400 : 1200,
    height: currentCropType === "profile" ? 400 : 400,
    imageSmoothingQuality: "high",
  });
  const croppedImageDataUrl = canvas.toDataURL("image/jpeg");
  if (currentCropType === "profile") {
    document.getElementById("profile-pic-display").src = croppedImageDataUrl;
    console.log("Nova imagem de perfil (Base64):", croppedImageDataUrl.substring(0, 50) + "...");
  } else if (currentCropType === "cover") {
    document.getElementById("cover-photo-display").src = croppedImageDataUrl;
    console.log("Nova imagem de capa (Base64):", croppedImageDataUrl.substring(0, 50) + "...");
  }
  closeCropModal();
}

