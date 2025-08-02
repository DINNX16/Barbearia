// Barbearia/Assets/Pages/js/script.js

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const signupForm = document.getElementById("signupForm");
    const formContent = document.getElementById("formContent");
    const userTypeButtons = document.querySelectorAll(".user-type-btn");
    const loginRedirectBtn = document.getElementById("loginRedirectBtn");
    const loginBtn = document.getElementById("loginBtn");

    let currentUserType = "";

    const formTemplates = {
        client: `
            <h1>Criar Conta de Cliente</h1>
            <input type="text" placeholder="Nome Completo" name="nome_completo" required>
            <input type="email" placeholder="E-mail" name="email" required>
            <input type="password" placeholder="Senha" name="senha" required>
            `,
        professional: `
            <h1>Cadastro de Profissional</h1>
            <input type="text" placeholder="Nome Completo" name="nome_completo" required>
            <input type="email" placeholder="E-mail Profissional" name="email" required>
            <input type="password" placeholder="Senha" name="senha" required>
            <input type="text" placeholder="Especializações (ex: Corte, Barba)" name="especializacao" required>
            <!-- CAMPO DE VERIFICAÇÃO COMENTADO NO HTML -->
            <!-- <input type="text" placeholder="Código de Verificação" name="verification_code" class="verification-code-input"> -->
        `,
        owner: `
            <h1>Cadastro de Proprietário</h1>
            <input type="text" placeholder="Nome Completo" name="nome_completo" required>
            <input type="email" placeholder="E-mail de Contato" name="email" required>
            <input type="password" placeholder="Senha" name="senha" required>
            <input type="text" placeholder="CNPJ da Barbearia" name="cnpj" required>
            <!-- CAMPO DE VERIFICAÇÃO COMENTADO NO HTML -->
            <!-- <input type="text" placeholder="Código de Administrador" name="verification_code" class="verification-code-input"> -->
        `,
    };

    function selectUserType(type) {
        currentUserType = type;
        formContent.innerHTML = formTemplates[type] || "";
        container.classList.add("right-panel-active");
    }

    /*
    async function validateVerificationCode(code, type) {
        console.log(`Validando código "${code}" para o tipo "${type}"...`);
        const validCodes = {
            professional: ["PRO123", "BARBER456"],
            owner: ["OWNER789", "MANOV555"],
        };
        await new Promise((resolve) => setTimeout(resolve, 500));
        return validCodes[type]?.includes(code.toUpperCase()) || false;
    }
    */

    function redirectToLogin() {
        window.location.href = 'login.html';
    }

    userTypeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");
            selectUserType(type);
        });
    });

    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitButton = signupForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";

        const formData = new FormData(signupForm);

        const senhaDoCampo = formData.get('senha');
        const userData = {
            email: formData.get('email'),
            senha: (senhaDoCampo === null || senhaDoCampo === undefined) ? '' : String(senhaDoCampo),
            nome_completo: formData.get('nome_completo'),
            tipo_usuario: currentUserType
        };

        if (userData.tipo_usuario === 'client') {
            userData.tipo_usuario = 'cliente';
        } else if (userData.tipo_usuario === 'professional') {
            userData.tipo_usuario = 'profissional';
        } else if (userData.tipo_usuario === 'owner') {
            userData.tipo_usuario = 'proprietario';
        }

        if (!userData.nome_completo || !userData.email || userData.senha.trim() === '') {
            alert('Por favor, preencha todos os campos obrigatórios corretamente, incluindo a senha.');
            submitButton.disabled = false;
            submitButton.textContent = "Cadastrar";
            return;
        }

        if (currentUserType === "professional") {
            userData.especializacao = formData.get('especializacao');
        } else if (currentUserType === "owner") {
            userData.cnpj = formData.get('cnpj');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Cadastro bem-sucedido:', data);
                container.classList.remove("right-panel-active");

                alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
                
                setTimeout(() => {
                    // Redireciona para login.html após o cadastro.
                    window.location.href = 'login.html';
                }, 800);

            } else {
                console.error('Erro no cadastro:', data.message || response.statusText);
                alert('Erro no cadastro: ' + (data.message || 'Verifique os dados.'));
                submitButton.disabled = false;
                submitButton.textContent = "Cadastrar";
            }
        } catch (error) {
            console.error('Erro na requisição de cadastro:', error);
            alert('Não foi possível conectar ao servidor. Verifique se o backend está online e tente novamente.');
            submitButton.disabled = false;
            submitButton.textContent = "Cadastrar";
        }
    });

    if (loginRedirectBtn) {
        loginRedirectBtn.addEventListener("click", redirectToLogin);
    }
    if (loginBtn) {
        loginBtn.addEventListener("click", redirectToLogin);
    }
    
    // LÓGICA DE ROTEAMENTO, LOADING E CARROSSEL
    function handleSectionDisplay() {
        const hash = window.location.hash;
        if (hash) {
            const sectionId = hash.substring(1);
            showContent(sectionId);
        } else {
            if (document.getElementById("cortes")) {
                showContent("cortes");
            }
        }
    }

    function showContent(sectionId) {
        var sections = document.querySelectorAll(".content-section");
        sections.forEach(function (section) {
            section.classList.remove("active");
        });
        var activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add("active");
        }
    }

    handleSectionDisplay();
    window.addEventListener("hashchange", handleSectionDisplay);

    let contador = 3;
    function iniciarLoading() {
        let contadorEl = document.getElementById("contador");
        if (!contadorEl) {
            console.warn("Elemento 'contador' não encontrado para o loading.");
            return;
        }
        let intervalo = setInterval(() => {
            contador--;
            contadorEl.textContent = contador;
            if (contador <= 0) {
                clearInterval(intervalo);
                document.getElementById("loading").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("loading").style.display = "none";
                    document.getElementById("conteudo").classList.add("mostrar");
                }, 500);
            }
        }, 1000);
    }
    if (document.getElementById("loading")) {
        setTimeout(iniciarLoading, 100);
    }

    const track = document.querySelector(".carousel-track");
    const nextButton = document.querySelector(".next-button");
    const prevButton = document.querySelector(".prev-button");

    if (track && nextButton && prevButton) {
        const cards = Array.from(track.children);
        cards.forEach((card) => {
            const clone = card.cloneNode(true);
            track.appendChild(clone);
        });

        let currentIndex = 0;
        let isMoving = false;

        function getCardWidth() {
            const cardStyle = window.getComputedStyle(cards[0]);
            const trackStyle = window.getComputedStyle(track);
            const cardWidth = cards[0].offsetWidth;
            const cardGap = parseFloat(trackStyle.gap) || 0;
            return cardWidth + cardGap;
        }

        function updatePosition(transition = true) {
            track.style.transition = transition
                ? "transform 0.6s ease-in-out"
                : "none";
            const cardWidth = getCardWidth();
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }

        function handleNext() {
            if (isMoving) return;
            isMoving = true;
            currentIndex++;
            updatePosition();
        }

        function handlePrev() {
            if (isMoving) return;
            isMoving = true;
            if (currentIndex === 0) {
                currentIndex = cards.length;
                updatePosition(false);
                setTimeout(() => {
                    currentIndex--;
                    updatePosition();
                }, 20);
            } else {
                currentIndex--;
                updatePosition();
            }
        }

        track.addEventListener("transitionend", () => {
            isMoving = false;
            if (currentIndex >= cards.length) {
                currentIndex = 0;
                updatePosition(false);
            }
        });

        nextButton.addEventListener("click", handleNext);
        prevButton.addEventListener("click", handlePrev);

        window.addEventListener("resize", () => updatePosition(false));
    }
});

function openNav() {
    document.getElementById("myNav").style.width = "50%";
}

function closeNav() {
    document.getElementById("myNav").style.width = "0%";
}
