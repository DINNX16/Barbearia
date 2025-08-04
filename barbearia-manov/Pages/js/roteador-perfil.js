// /js/roteador-perfil.js

document.addEventListener('DOMContentLoaded', () => {
    // URL base da sua API (se já tiver noutro ficheiro, pode importar)
    const API_BASE_URL = 'http://localhost:3000'; // Ajuste se for diferente

    const redirecionarPerfil = async () => {
        const token = localStorage.getItem('jwtToken');

        // Se não houver token, manda para o login
        if (!token) {
            console.log('Nenhum token encontrado. Redirecionando para o login.');
            window.location.href = 'login.html';
            return;
        }

        try {
            // Tenta obter os dados do perfil da nova rota da API
            const response = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Se o token for inválido ou expirado, a API retornará um erro
            if (!response.ok) {
                console.error('Token inválido ou expirado. Limpando e redirecionando para login.');
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
                return;
            }

            const data = await response.json();
            const tipoUsuario = data.user.tipo_usuario;
            
            console.log('Tipo de usuário recebido da API:', tipoUsuario);

            // Redireciona com base no tipo de usuário
            switch (tipoUsuario) {
                case 'cliente':
                    window.location.href = 'perfil-cliente.html';
                    break;
                case 'profissional':
                    window.location.href = 'perfil-funcionario.html';
                    break;
                case 'proprietario':
                    window.location.href = 'perfil-proprietario.html';
                    break;
                default:
                    // Caso de segurança: se o tipo for desconhecido, volta para a página principal
                    console.warn('Tipo de usuário desconhecido. Redirecionando para a página principal.');
                    window.location.href = 'main.html';
                    break;
            }

        } catch (error) {
            // Em caso de erro de rede ou falha do servidor
            console.error('Erro de rede ao buscar perfil:', error);
            alert('Não foi possível conectar ao servidor para verificar seu perfil. Tente novamente.');
            window.location.href = 'login.html';
        }
    };

    // Inicia o processo de redirecionamento
    redirecionarPerfil();
});