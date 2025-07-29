document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetForm');

    resetForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Pega os dados salvos temporariamente na etapa anterior
        const savedCode = sessionStorage.getItem('recoveryCode');
        const emailToReset = sessionStorage.getItem('emailToReset');

        // Pega os dados que o usuário digitou agora
        const enteredCode = document.getElementById('codeInput').value;
        const newPassword = document.getElementById('newPasswordInput').value;

        if (savedCode === enteredCode) {
            // SUCESSO: O código bate!
            
            // --- PONTO IMPORTANTE DA SIMULAÇÃO ---
            // Em uma aplicação real, aqui você enviaria a nova senha e o email/token para o back-end
            // para que ele ATUALIZASSE o banco de dados.
            // Como não temos back-end, apenas vamos confirmar o sucesso para o usuário.
            console.log(`SIMULAÇÃO: A senha do usuário ${emailToReset} foi alterada para "${newPassword}"`);
            
            alert('Senha redefinida com sucesso!');

            // Limpa os dados temporários
            sessionStorage.removeItem('recoveryCode');
            sessionStorage.removeItem('emailToReset');

            // Envia o usuário para a tela de login para que ele entre com a nova senha
            window.location.href = 'login.html';
        } else {
            // ERRO: O código não confere
            alert('Código de recuperação inválido.');
        }
    });
});