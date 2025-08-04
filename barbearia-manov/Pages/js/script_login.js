// Barbearia/Assets/Pages/js/script_login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');

            const email = emailInput ? emailInput.value : '';
            const senha = senhaInput ? senhaInput.value : '';

            if (!email || !senha) {
                alert('Por favor, preencha ambos, email e senha.');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Login bem-sucedido:', data);
                    localStorage.setItem('jwtToken', data.token);
                    localStorage.setItem('currentUser', JSON.stringify(data.user));

                    alert('Login realizado com sucesso! Bem-vindo!');
                    // AQUI ESTÁ A CORREÇÃO: Altere para main.html
                    window.location.href = 'main.html';
                } else {
                    console.error('Erro no login:', data.message || response.statusText);
                    alert('Erro no login: ' + (data.message || 'Verifique suas credenciais.'));
                }
            } catch (error) {
                console.error('Erro na requisição de login:', error);
                alert('Não foi possível conectar ao servidor. Verifique se o backend está online e tente novamente.');
            }
        });
    } else {
        console.warn('Formulário de login não encontrado. Verifique o ID "loginForm".');
    }
});
