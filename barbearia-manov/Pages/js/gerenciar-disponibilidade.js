// js/gerenciar-disponibilidade.js
document.addEventListener('DOMContentLoaded', () => {
  // --- ELEMENTOS E VARIÁVEIS ---
  const form = document.getElementById('disponibilidade-form');
  const semanaContainer = document.getElementById('semana-container');
  const diasDaSemana = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  // IMPORTANTE: Precisamos saber qual profissional está logado.
  // Esta informação deve vir do seu token JWT após o login.
  // Por enquanto, vamos usar um ID fixo para teste.
  const idProfissionalLogado = 1; // Mude para o ID do profissional que você quer testar

  // --- FUNÇÕES ---

  /**
   * Busca e exibe a disponibilidade do profissional.
   */
  async function carregarDisponibilidade() {
    if (!idProfissionalLogado) {
      semanaContainer.innerHTML = '<p>Erro: Não foi possível identificar o profissional.</p>';
      return;
    }

    try {
      const response = await fetch(`/api/disponibilidades/profissional/${idProfissionalLogado}`);
      const disponibilidades = await response.json();

      // Limpa o container antes de renderizar
      semanaContainer.innerHTML = '';

      // Renderiza cada dia da semana
      diasDaSemana.forEach((nomeDia, indexDia) => {
        const horariosDoDia = disponibilidades.filter(d => d.dia_semana === indexDia);

        const diaDiv = document.createElement('div');
        diaDiv.className = 'dia-container';

        let horariosHtml = '<div class="horarios-lista">';
        if (horariosDoDia.length > 0) {
          horariosDoDia.forEach(h => {
            const inicio = new Date(h.hora_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const fim = new Date(h.hora_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            horariosHtml += `
                            <div class="horario-item">
                                <span>${inicio} - ${fim}</span>
                                <button class="btn-remover-horario" data-id="${h.id_disponibilidade}">&times;</button>
                            </div>
                        `;
          });
        } else {
          horariosHtml += '<p style="font-size: 0.9rem; color: #888;">Nenhum horário cadastrado.</p>';
        }
        horariosHtml += '</div>';

        diaDiv.innerHTML = `<div class="dia-header">${nomeDia}</div>${horariosHtml}`;
        semanaContainer.appendChild(diaDiv);
      });

    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
      semanaContainer.innerHTML = '<p>Não foi possível carregar os horários.</p>';
    }
  }

  /**
   * Lida com o envio do formulário para adicionar um novo horário.
   */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const dia_semana = document.getElementById('dia-semana').value;
    const hora_inicio = document.getElementById('hora-inicio').value;
    const hora_fim = document.getElementById('hora-fim').value;

    // O Prisma espera datas completas no formato ISO. Criamos uma data base e adicionamos a hora.
    const dataInicioISO = `1970-01-01T${hora_inicio}:00.000Z`;
    const dataFimISO = `1970-01-01T${hora_fim}:00.000Z`;

    const token = localStorage.getItem('seuTokenJWT');

    try {
      const response = await fetch('/api/disponibilidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id_profissional: idProfissionalLogado,
          dia_semana: parseInt(dia_semana),
          hora_inicio: dataInicioISO,
          hora_fim: dataFimISO
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro ao salvar horário.');
      }

      form.reset(); // Limpa o formulário
      carregarDisponibilidade(); // Recarrega a lista
    } catch (error) {
      alert(error.message);
    }
  });

  /**
   * Lida com cliques para remover um horário.
   */
  semanaContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-remover-horario')) {
      const idDisponibilidade = event.target.dataset.id;
      if (confirm('Tem certeza que deseja remover este horário?')) {
        const token = localStorage.getItem('seuTokenJWT');
        try {
          const response = await fetch(`/api/disponibilidades/${idDisponibilidade}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!response.ok) throw new Error('Não foi possível remover o horário.');

          carregarDisponibilidade(); // Recarrega a lista
        } catch (error) {
          alert(error.message);
        }
      }
    }
  });

  // --- INICIALIZAÇÃO ---
  carregarDisponibilidade();
});