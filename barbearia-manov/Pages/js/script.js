document.addEventListener("DOMContentLoaded", () => {
  // --- SELEÇÃO DE ELEMENTOS DO DOM ---
  const container = document.getElementById("container");
  const signupForm = document.getElementById("signupForm");
  const formContent = document.getElementById("formContent");
  const userTypeButtons = document.querySelectorAll(".user-type-btn");
  const loginRedirectBtn = document.getElementById("loginRedirectBtn");
  const loginBtn = document.getElementById("loginBtn");

  // --- ESTADO DA APLICAÇÃO ---
  let currentUserType = "";

  // --- TEMPLATES DOS FORMULÁRIOS ---
  const formTemplates = {
    client: `
            <h1>Criar Conta de Cliente</h1>
            <input type="text" placeholder="Nome Completo" name="full_name" required>
            <input type="email" placeholder="E-mail" name="email" required>
            <input type="password" placeholder="Senha" name="password" required>
            <input type="date" placeholder="Data de Nascimento" name="birthdate" required title="Data de Nascimento">
        `,
    professional: `
            <h1>Cadastro de Profissional</h1>
            <input type="text" placeholder="Nome Completo" name="full_name" required>
            <input type="email" placeholder="E-mail Profissional" name="email" required>
            <input type="password" placeholder="Senha" name="password" required>
            <input type="text" placeholder="Especializações (ex: Corte, Barba)" name="specialization" required>
            <input type="text" placeholder="Código de Verificação" name="verification_code" required>
        `,
    owner: `
            <h1>Cadastro de Proprietário</h1>
            <input type="text" placeholder="Nome Completo" name="full_name" required>
            <input type="email" placeholder="E-mail de Contato" name="email" required>
            <input type="password" placeholder="Senha" name="password" required>
            <input type="text" placeholder="CNPJ da Barbearia" name="cnpj" required>
            <input type="text" placeholder="Código de Administrador" name="verification_code" required>
        `,
  };

  // --- FUNÇÕES ---

  /**
   * Seleciona o tipo de usuário e exibe o formulário correspondente.
   * @param {string} type - O tipo de usuário ('client', 'professional', 'owner').
   */
  function selectUserType(type) {
    currentUserType = type;
    formContent.innerHTML = formTemplates[type] || "";
    container.classList.add("right-panel-active");
  }

  /**
   * Simula a validação de um código de verificação (função assíncrona para imitar uma chamada de API).
   * @param {string} code - O código a ser validado.
   * @param {string} type - O tipo de usuário para validar o código.
   * @returns {Promise<boolean>} - Retorna true se o código for válido, senão false.
   */
  async function validateVerificationCode(code, type) {
    console.log(`Validando código "${code}" para o tipo "${type}"...`);
    // Na prática, isso seria uma chamada: await fetch('/api/validate-code', ...)
    const validCodes = {
      professional: ["PRO123", "BARBER456"],
      owner: ["OWNER789", "MANOV555"],
    };
    // Simula um pequeno atraso da rede
    await new Promise((resolve) => setTimeout(resolve, 500));
    return validCodes[type]?.includes(code.toUpperCase()) || false;
  }

  /**
   * Redireciona para a página de login.
   */
  function redirectToLogin() {
    // Volta para a pasta raiz (barbearia-manov) e entra em Pages/login.html
    window.location.href = "../Pages/login.html";
  }

  // --- OUVINTES DE EVENTOS (EVENT LISTENERS) ---

  // Adiciona evento de clique para cada botão de tipo de usuário
  userTypeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-type");
      selectUserType(type);
    });
  });

  // Manipula a submissão do formulário de cadastro
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitButton = signupForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    // Validação específica para profissional e proprietário
    if (currentUserType === "professional" || currentUserType === "owner") {
      const verificationCodeInput = signupForm.querySelector(
        'input[name="verification_code"]'
      );
      const isValid = await validateVerificationCode(
        verificationCodeInput.value,
        currentUserType
      );

      if (!isValid) {
        alert("Código de verificação inválido! Por favor, tente novamente.");
        submitButton.disabled = false;
        submitButton.textContent = "Cadastrar";
        verificationCodeInput.focus();
        return;
      }
    }

    // Simulação de envio para o backend
    console.log(`Enviando dados do formulário para o tipo: ${currentUserType}`);
    const formData = new FormData(signupForm);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Simula espera da resposta do servidor
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Animação para o painel de sucesso
    container.classList.remove("right-panel-active");

    // Limpa o formulário após o "sucesso"
    setTimeout(() => {
      redirectToLogin();
    }, 800); // Espera a animação terminar e então redireciona.
  });

  // Adiciona evento de clique aos botões de redirecionamento para login
  loginRedirectBtn.addEventListener("click", redirectToLogin);
  loginBtn.addEventListener("click", redirectToLogin);
});
