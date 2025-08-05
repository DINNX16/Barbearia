// js/perfil.js

const API_BASE_URL = 'http://localhost:3000'; // Ajuste se necessário

// =============================================================
// INICIALIZAÇÃO E EVENT LISTENERS
// =============================================================

document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  setupEventListeners();
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// =============================================================
// LÓGICA DE UPLOAD, CROP E EVENTOS
// =============================================================

function setupEventListeners() {
  // --- Elementos do DOM ---
  const profilePicInput = document.getElementById("profile-pic-input");
  const coverPhotoInput = document.getElementById("cover-photo-input");
  const profilePicContainer = document.querySelector(".profile-pic-container");
  const editCoverBtn = document.getElementById("edit-cover-photo-btn");
  const cropModal = document.getElementById("crop-modal");
  const imageToCrop = document.getElementById("image-to-crop");
  const confirmCropBtn = document.getElementById("confirm-crop-btn");
  const cancelCropBtn = document.getElementById("cancel-crop-btn");

  let cropper = null;
  let currentCropConfig = {};

  // --- Gatilhos para abrir o seletor de arquivos ---
  profilePicContainer.addEventListener("click", () => profilePicInput.click());
  editCoverBtn.addEventListener("click", () => coverPhotoInput.click());

  // --- Função genérica para abrir o modal ---
  const openCropModal = (event, config) => {
    if (event.target.files && event.target.files.length > 0) {
      currentCropConfig = config;
      const reader = new FileReader();
      reader.onload = (e) => {
        imageToCrop.src = e.target.result;
        cropModal.style.display = "flex";
        if (cropper) cropper.destroy();
        cropper = new Cropper(imageToCrop, {
          aspectRatio: config.aspectRatio,
          viewMode: 1,
          background: false,
        });
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    event.target.value = '';
  };

  // --- Listeners para cada tipo de input ---
  profilePicInput.addEventListener("change", (e) => openCropModal(e, {
    aspectRatio: 1 / 1,
    uploadFieldName: 'profilePic',
    endpoint: '/api/usuarios/me/foto-perfil',
    elementIdToUpdate: 'profile-pic-display',
    responseKey: 'foto_perfil'
  }));
  coverPhotoInput.addEventListener("change", (e) => openCropModal(e, {
    aspectRatio: 16 / 9,
    uploadFieldName: 'coverPic',
    endpoint: '/api/usuarios/me/foto-capa',
    elementIdToUpdate: 'cover-photo-display',
    responseKey: 'foto_capa'
  }));

  // --- Lógica do modal ---
  const closeCropModal = () => (cropModal.style.display = "none");
  cancelCropBtn.addEventListener("click", closeCropModal);

  confirmCropBtn.addEventListener("click", (event) => {
    // CORREÇÃO CRUCIAL PARA IMPEDIR O REFRESH
    event.preventDefault();

    if (!cropper) return;
    confirmCropBtn.textContent = "A Enviar...";
    confirmCropBtn.disabled = true;

    cropper.getCroppedCanvas({
      width: currentCropConfig.aspectRatio === 1 ? 400 : 1200,
      imageSmoothingQuality: 'high',
    }).toBlob(async (blob) => {
      try {
        const response = await uploadImage(blob, currentCropConfig.uploadFieldName, currentCropConfig.endpoint);
        const newImageUrl = `${API_BASE_URL}${response[currentCropConfig.responseKey]}?t=${new Date().getTime()}`;
        document.getElementById(currentCropConfig.elementIdToUpdate).src = newImageUrl;
        alert('Imagem atualizada com sucesso!');
      } catch (error) {
        alert(`Erro ao enviar imagem: ${error.message}`);
        console.error(error);
      } finally {
        closeCropModal();
        confirmCropBtn.textContent = "Salvar Alterações";
        confirmCropBtn.disabled = false;
      }
    }, 'image/jpeg');
  });
}

async function uploadImage(imageBlob, fieldName, endpoint) {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('Utilizador não autenticado.');
  const formData = new FormData();
  formData.append(fieldName, imageBlob, 'upload.jpg');
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha no upload.');
  }
  return await response.json();
}

// =============================================================
// LÓGICA PRINCIPAL DE CARREGAMENTO DE DADOS
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
    const upcomingAppointments = allAppointments.filter(ag => ['agendado', 'confirmado'].includes(ag.status.toLowerCase()));
    const historyAppointments = allAppointments.filter(ag => ['concluído', 'cancelado'].includes(ag.status.toLowerCase()));
    const lastServices = [...historyAppointments].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 2);
    renderGenericList(upcomingAppointments, "proximos-agendamentos-list", "empty-proximos-agendamentos", createAppointmentsHtml);
    renderGenericList(lastServices, "ultimos-servicos-list", "empty-ultimos-servicos", createAppointmentsHtml);
    renderGenericList(historyAppointments, "historico-agendamentos-list", "empty-historico-agendamentos", createAppointmentsHtml);
  } catch (error) {
    console.error("Não foi possível carregar os dados do perfil:", error.message);
  }
}

// =============================================================
// FUNÇÕES DE FETCH (CHAMADAS À API)
// =============================================================

async function fetchUserProfile() {
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    console.error('Token não encontrado, redirecionando para login.');
    window.location.href = 'login.html';
    throw new Error('Token de autenticação não encontrado.');
  }
  const response = await fetch(`${API_BASE_URL}/api/auth/perfil`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) {
    console.error('Falha ao autenticar, redirecionando para login.');
    localStorage.clear();
    window.location.href = 'login.html';
    throw new Error('Falha na autenticação do token.');
  }
  const data = await response.json();
  return data.user;
}

async function fetchAppointments() {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('Token não encontrado.');
  const response = await fetch(`${API_BASE_URL}/api/agendamentos/meus-agendamentos`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Falha ao buscar agendamentos.');
  return await response.json();
}

async function fetchPurchases() {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('Token não encontrado.');
  const response = await fetch(`${API_BASE_URL}/api/pedidos/meus-pedidos`, { headers: { 'Authorization': `Bearer ${token}` } });
  if (!response.ok) throw new Error('Falha ao buscar histórico de compras.');
  return await response.json();
}

// =============================================================
// FUNÇÕES DE RENDERIZAÇÃO E FORMATAÇÃO (HELPERS)
// =============================================================

function renderUserProfile(userData) {
  const defaultAvatar = '../assets/default-avatar.png';
  const defaultCover = '../assets/default-cover.jpg';
  const nome = userData.pessoa?.nome_completo || 'Nome não disponível';
  let fotoUrl = userData.pessoa?.foto_perfil;
  let fotoCapaUrl = userData.pessoa?.foto_capa;

  if (fotoUrl) fotoUrl = `${API_BASE_URL}${fotoUrl}`;
  if (fotoCapaUrl) fotoCapaUrl = `${API_BASE_URL}${fotoCapaUrl}`;

  document.getElementById("profile-pic-display").src = fotoUrl || defaultAvatar;
  document.getElementById("cover-photo-display").src = fotoCapaUrl || defaultCover;
  document.getElementById("user-name-display").textContent = nome;
  document.getElementById("user-email-display").textContent = userData.email || "Email não informado";
}

function formatDate(dateString) {
  if (!dateString) return "Data indisponível";
  const date = new Date(dateString);
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