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

// ATUALIZADO: Agora também busca uma foto de capa.
async function mockFetchUserProfile() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nome: "José Bezerra",
        email: "jose.bezerra@email.com",
        fotoUrl: "https://pm1.aminoapps.com/6688/88e84a41268e9a8d6a522254710158ab1e4cbb26_hq.jpg",
        fotoCapaUrl: "https://i.pinimg.com/originals/1e/70/ae/1e70ae41273934d75891e49646b1a37a.jpg", // URL da foto de capa
      });
    }, 500);
  });
}

async function mockFetchUpcomingAppointments() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, servico: "Corte de Cabelo + Barba Detalhada", data: "2025-06-15T14:30:00", preco: 80.0, status: "Agendado" },
        { id: 2, servico: "Manutenção de Barba", data: "2025-06-30T10:00:00", preco: 45.0, status: "Agendado" },
      ]);
    }, 700);
  });
}

async function mockFetchLastServices() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 3, servico: "Corte Social", data: "2025-06-01T15:00:00", preco: 60.0, status: "Concluído" },
        { id: 4, servico: "Sobrancelha Masculina", data: "2025-05-20T11:30:00", preco: 25.0, status: "Concluído" },
      ]);
    }, 600);
  });
}

async function mockFetchAppointmentsHistory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 6, servico: "Corte Degradê", data: "2025-04-15T14:00:00", preco: 65.0, status: "Concluído" },
        { id: 7, servico: "Barba Completa Clássica", data: "2025-04-01T10:30:00", preco: 40.0, status: "Concluído" },
        { id: 8, servico: "Corte + Barba (Cancelado)", data: "2025-03-20T13:00:00", preco: 80.0, status: "Cancelado" },
      ]);
    }, 800);
  });
}

async function mockFetchPurchasesHistory() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, produto: "Kit Barber - Pomada Modeladora + Pente de Madeira", data: "2025-06-10", preco: 120.0, status: "Entregue" },
        { id: 102, produto: "Navalhete Profissional Aço Inox", data: "2025-05-25", preco: 85.0, status: "Entregue" },
      ]);
    }, 900);
  });
}

// --- Funções para renderizar os dados no HTML ---

// ATUALIZADO: Renderiza a foto de perfil e a nova foto de capa.
function renderUserProfile(userData) {
  document.getElementById("profile-pic-display").src = userData.fotoUrl || "https://via.placeholder.com/150";
  document.getElementById("profile-pic-display").alt = `Foto de ${userData.nome}`;
  document.getElementById("cover-photo-display").src = userData.fotoCapaUrl || "https://via.placeholder.com/1200x400";
  document.getElementById("cover-photo-display").alt = `Foto de capa de ${userData.nome}`;
  document.getElementById("user-name-display").textContent = userData.nome || "Nome não informado";
  document.getElementById("user-email-display").textContent = userData.email || "Email não informado";
}

function getStatusClass(status) {
  if (!status) return "";
  const s = status.toLowerCase();
  if (s === "agendado" || s === "upcoming") return "status-upcoming";
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
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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

// --- Função principal para carregar todos os dados ---
async function loadProfileData() {
  try {
    const [
      userData,
      upcomingAppointments,
      lastServices,
      appointmentsHistory,
      purchasesHistory,
    ] = await Promise.all([
      mockFetchUserProfile(),
      mockFetchUpcomingAppointments(),
      mockFetchLastServices(),
      mockFetchAppointmentsHistory(),
      mockFetchPurchasesHistory(),
    ]);

    renderUserProfile(userData);
    renderGenericList(upcomingAppointments, "proximos-agendamentos-list", "empty-proximos-agendamentos", createAppointmentsHtml);
    renderGenericList(lastServices, "ultimos-servicos-list", "empty-ultimos-servicos", createAppointmentsHtml);
    renderGenericList(appointmentsHistory, "historico-agendamentos-list", "empty-historico-agendamentos", createAppointmentsHtml);
    renderGenericList(purchasesHistory, "historico-compras-list", "empty-historico-compras", createPurchasesHtml);
  } catch (error) {
    console.error("Erro ao carregar dados do perfil:", error);
    document.getElementById("user-name-display").textContent = "Erro ao carregar";
    document.getElementById("user-email-display").textContent = "Tente novamente mais tarde.";
  }
}

// --- Inicialização e Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  loadProfileData();
  document.getElementById("current-year").textContent = new Date().getFullYear();

  // Elementos do DOM para a nova funcionalidade
  const profilePicInput = document.getElementById("profile-pic-input");
  const profilePicContainer = document.querySelector(".profile-pic-container");
  const coverPhotoInput = document.getElementById("cover-photo-input");
  const editCoverBtn = document.getElementById("edit-cover-photo-btn");
  const confirmCropBtn = document.getElementById("confirm-crop-btn");
  const cancelCropBtn = document.getElementById("cancel-crop-btn");

  // Evento para acionar o input da foto de perfil
  profilePicContainer.addEventListener("click", () => profilePicInput.click());

  // Evento para acionar o input da foto de capa
  editCoverBtn.addEventListener("click", () => coverPhotoInput.click());

  // Evento quando um novo arquivo de perfil é selecionado
  profilePicInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      openCropModal(e.target.files[0], "profile", 1); // aspectRatio 1 (quadrado)
    }
    e.target.value = ""; // Limpa o input para permitir selecionar a mesma imagem novamente
  });

  // Evento quando um novo arquivo de capa é selecionado
  coverPhotoInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files.length > 0) {
      openCropModal(e.target.files[0], "cover", 3 / 1); // aspectRatio 3:1 (retangular)
    }
    e.target.value = ""; // Limpa o input
  });

  // Eventos dos botões do modal
  confirmCropBtn.addEventListener("click", handleCrop);
  cancelCropBtn.addEventListener("click", closeCropModal);

  // Botão original de editar perfil
  document.querySelector(".edit-profile").addEventListener("click", function () {
    alert("Funcionalidade de edição de perfil será implementada aqui!");
  });
});