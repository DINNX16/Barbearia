document.addEventListener('DOMContentLoaded', () => {
    // Replicamos o "banco de dados" aqui para poder consultá-lo
    // Em um projeto real, isso seria uma chamada de API para o back-end
    const fakeUsersDatabase = [
        { email: 'cliente@email.com', password: '123', name: 'João Silva', role: 'Cliente' },
        { email: 'barbeiro@email.com', password: '123', name: 'Carlos Andrade', role: 'Profissional' },
        { email: 'dono@email.com', password: '123', name: 'Sr. Manóv', role: 'Proprietário' }
    ];

    const recoverForm = document.getElementById('recoverForm');

    recoverForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('emailInput').value;
        const userExists = fakeUsersDatabase.find(user => user.email === email);

        if (userExists) {
            // SUCESSO: O e-mail existe!
            // 1. Geramos um código aleatório simples (nossa simulação do token)
            const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();

            // 2. Salva o código e o email temporariamente para a próxima página verificar
            sessionStorage.setItem('recoveryCode', recoveryCode);
            sessionStorage.setItem('emailToReset', email);

            // 3. A "MÁGICA" DA SIMULAÇÃO: Em vez de enviar um e-mail, mostramos o código na tela!
            alert(`E-mail encontrado!\n\nSeu código de recuperação é: ${recoveryCode}\n\nVocê será redirecionado para a página de redefinição.`);
            
            // 4. Redireciona para a página de redefinição
            window.location.href = 'redefinir.html';

        } else {
            // ERRO: O e-mail não foi encontrado
            alert('E-mail não encontrado em nossa base de dados.');
        }
    });
});