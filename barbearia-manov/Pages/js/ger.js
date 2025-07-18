        
        const availableIcons = [
            '../assets/icones_tela_avisos/promocao.png',
            '../assets/icones_tela_avisos/.png',
            '../assets/icones_tela_avisos/horario.png',
            '../assets/icones_tela_avisos/.png',
            '../assets/icones_tela_avisos/.png',
            '../assets/icones_tela_avisos/bigode.png',
        ];

        let avisosData = [
            { id: 1, titulo: "Nova Promoção Chegando!", descricao: "Prepare-se para a nossa incrível 'Promoção Bigode de Respeito'! A partir do dia 15 de Julho, todos os serviços de barba terão 20% de desconto!", data_publicacao: "2025-07-05T10:00:00", data_expiracao: null, tag: "Promoção", tipo_aviso: "promocao", caminho_icone: "../assets/icones_tela_avisos/promocao.png", link_redirecionamento: null, ativo: true },
            { id: 2, titulo: "Atenção: Estaremos Fechados", descricao: "Informamos que a barbearia estará fechada nos dias 20 e 21 de Julho para manutenção e treinamento da equipe.", data_publicacao: "2025-07-05T12:00:00", data_expiracao: null, tag: "Urgente", tipo_aviso: "fechado", caminho_icone: "../assets/icones_tela_avisos/aviso_urgente.png", link_redirecionamento: null, ativo: true },
            { id: 3, titulo: "Horário de Atendimento Especial", descricao: "No dia 18 de Julho, atenderemos em horário reduzido, das 09:00 às 15:00, devido a um evento especial.", data_publicacao: "2025-07-06T09:00:00", data_expiracao: null, tag: "Horário", tipo_aviso: "horario", caminho_icone: "../assets/icones_tela_avisos/horario.png", link_redirecionamento: "horario_funcionamento.html", ativo: true },
            { id: 4, titulo: "Novos Horários de Atendimento", descricao: "A partir de 1º de Agosto, nossos horários de atendimento serão: Segunda a Sexta: 09:00 - 19:00, Sábados: 08:00 - 17:00. Domingos e Feriados: Fechado.", data_publicacao: "2025-06-10T14:00:00", data_expiracao: null, tag: "Informação", tipo_aviso: "informacao", caminho_icone: "../assets/icones_tela_avisos/cortes.png", link_redirecionamento: "horario_funcionamento.html", ativo: true },
            { id: 5, titulo: "Conheça Nossos Novos Talentos!", descricao: "Recebemos novos barbeiros na equipe! Agende seu horário e experimente os serviços de nossos profissionais recém-chegados.", data_publicacao: "2025-06-01T08:00:00", data_expiracao: null, tag: "Novidades", tipo_aviso: "informacao", caminho_icone: "../assets/icones_tela_avisos/new.png", link_redirecionamento: null, ativo: true },
            { id: 6, titulo: "Dia do Cliente com Desconto Extra!", descricao: "Fique atento às nossas redes sociais no dia 15 de Setembro. Teremos um desconto surpresa exclusivo para nossos clientes mais fiéis!", data_publicacao: "2025-05-15T11:00:00", data_expiracao: null, tag: "Promoção", tipo_aviso: "promocao", caminho_icone: "../assets/icones_tela_avisos/promocao.png", link_redirecionamento: null, ativo: true },
            { id: 7, titulo: "Dicas de Cuidado com a Barba", descricao: "Confira em nosso blog as melhores dicas para manter sua barba sempre impecável. Produtos, técnicas e muito mais!", data_publicacao: "2025-04-20T16:00:00", data_expiracao: null, tag: "Dicas", tipo_aviso: "informacao", caminho_icone: "../assets/icones_tela_avisos/bigode.png", link_redirecionamento: null, ativo: true },
            { id: 8, titulo: "Seu Estilo em Destaque!", descricao: "Poste uma foto do seu corte ou barba feita na Barbearia Manóv nos marque e apareça em nossas redes sociais!", data_publicacao: "2025-03-25T10:00:00", data_expiracao: null, tag: "Redes sociais", tipo_aviso: "informacao", caminho_icone: "../assets/icones_tela_avisos/cortes.png", link_redirecionamento: null, ativo: false },
            { id: 9, titulo: "ALERTA: Manutenção Urgente!", descricao: "A barbearia passará por uma manutenção emergencial hoje, 08/07, das 14h às 16h. Agradecemos a compreensão.", data_publicacao: "2025-07-08T13:00:00", data_expiracao: null, tag: "Aviso Crítico", tipo_aviso: "urgente", caminho_icone: "../assets/icones_tela_avisos/aviso_urgente.png", link_redirecionamento: null, ativo: true }
        ];

        const avisoForm = document.getElementById('aviso-form');
        const avisoIdInput = document.getElementById('aviso-id');
        const tituloInput = document.getElementById('titulo');
        const descricaoInput = document.getElementById('descricao');
        const tagInput = document.getElementById('tag');
        const tipoAvisoSelect = document.getElementById('tipo-aviso');
        const linkRedirecionamentoInput = document.getElementById('link-redirecionamento');
        const ativoCheckbox = document.getElementById('ativo');
        const btnClearForm = document.getElementById('btn-clear-form');
        const avisosTableBody = document.getElementById('avisos-table-body');

        const selectedIconPreview = document.getElementById('selected-icon-preview');
        const selectedIconPathInput = document.getElementById('selected-icon-path');
        const openIconGalleryBtn = document.getElementById('open-icon-gallery-btn');
        const iconGalleryModal = document.getElementById('icon-gallery-modal');
        const closeModalBtn = document.querySelector('.close-modal-btn');
        const iconGrid = document.getElementById('icon-grid');

        const customDateInput = document.getElementById('custom-date-input');
        const customTimeInput = document.getElementById('custom-time-input');
        const dataExpiracaoIsoInput = document.getElementById('data-expiracao-iso');

        const customDateModal = document.getElementById('custom-date-modal');
        const customTimeModal = document.getElementById('custom-time-modal');

        const datePickerDay = document.getElementById('date-picker-day');
        const datePickerMonth = document.getElementById('date-picker-month');
        const datePickerYear = document.getElementById('date-picker-year');

        const timePickerHour = document.getElementById('time-picker-hour');
        const timePickerMinute = document.getElementById('time-picker-minute');

        let selectedDay = 1;
        let selectedMonth = 0;
        let selectedYear = new Date().getFullYear();
        let selectedHour = 0;
        let selectedMinute = 0;

        function openCustomDateModal() {
            customDateModal.style.display = 'flex';
            populateDatePickers();
        }

        function closeCustomDateModal() {
            customDateModal.style.display = 'none';
        }

        function openCustomTimeModal() {
            customTimeModal.style.display = 'flex';
            populateTimePickers();
        }

        function closeCustomTimeModal() {
            customTimeModal.style.display = 'none';
        }

        function populateDatePickers() {
            datePickerDay.innerHTML = '';
            const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = String(i).padStart(2, '0');
                datePickerDay.appendChild(option);
            }
            datePickerDay.value = selectedDay;

            datePickerMonth.innerHTML = '';
            const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            months.forEach((month, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = month;
                datePickerMonth.appendChild(option);
            });
            datePickerMonth.value = selectedMonth;

            datePickerYear.innerHTML = '';
            const currentYear = new Date().getFullYear();
            for (let i = currentYear - 5; i <= currentYear + 10; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                datePickerYear.appendChild(option);
            }
            datePickerYear.value = selectedYear;

            datePickerDay.onchange = () => { selectedDay = parseInt(datePickerDay.value); };
            datePickerMonth.onchange = () => { selectedMonth = parseInt(datePickerMonth.value); populateDatePickers(); };
            datePickerYear.onchange = () => { selectedYear = parseInt(datePickerYear.value); populateDatePickers(); };
        }

        function populateTimePickers() {
            timePickerHour.innerHTML = '';
            for (let i = 0; i < 24; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = String(i).padStart(2, '0');
                timePickerHour.appendChild(option);
            }
            timePickerHour.value = selectedHour;

            timePickerMinute.innerHTML = '';
            for (let i = 0; i < 60; i += 5) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = String(i).padStart(2, '0');
                timePickerMinute.appendChild(option);
            }
            timePickerMinute.value = selectedMinute;
        }

        function updateDateTimeInputs() {
            const formattedDate = `${String(selectedDay).padStart(2, '0')}/${String(selectedMonth + 1).padStart(2, '0')}/${selectedYear}`;
            const formattedTime = `${String(selectedHour).padStart(2, '0')}:${String(selectedMinute).padStart(2, '0')}`;
            customDateInput.value = formattedDate;
            customTimeInput.value = formattedTime;

            const isoDate = new Date(selectedYear, selectedMonth, selectedDay, selectedHour, selectedMinute).toISOString();
            dataExpiracaoIsoInput.value = isoDate;
        }

        function renderIconGallery() {
            iconGrid.innerHTML = '';
            availableIcons.forEach(iconPath => {
                const iconButton = document.createElement('div');
                iconButton.className = 'icon-item-button';
                iconButton.innerHTML = `<img src="${iconPath}" alt="Ícone">`;
                iconButton.dataset.iconPath = iconPath;

                iconButton.addEventListener('click', () => selectIcon(iconPath));
                iconGrid.appendChild(iconButton);
            });
        }

        function selectIcon(iconPath) {
            selectedIconPathInput.value = iconPath;
            selectedIconPreview.innerHTML = `<img src="${iconPath}" alt="Ícone Selecionado">`;

            document.querySelectorAll('.icon-item-button').forEach(btn => btn.classList.remove('selected'));
            const selectedButton = document.querySelector(`.icon-item-button[data-icon-path="${iconPath}"]`);
            if (selectedButton) {
                selectedButton.classList.add('selected');
            }

            iconGalleryModal.style.display = 'none';
        }

        function renderAvisosTable() {
            avisosTableBody.innerHTML = '';
            avisosData.forEach(aviso => {
                const row = avisosTableBody.insertRow();
                row.innerHTML = `
                    <td data-label="ID">${aviso.id}</td>
                    <td data-label="Título">${aviso.titulo}</td>
                    <td data-label="Descrição">${aviso.descricao}</td>
                    <td data-label="Tag">${aviso.tag || '-'}</td>
                    <td data-label="Tipo">${aviso.tipo_aviso}</td>
                    <td data-label="Ativo">${aviso.ativo ? 'Sim' : 'Não'}</td>
                    <td data-label="Ações" class="table-actions">
                        <button class="btn-action btn-edit" data-id="${aviso.id}">Editar</button>
                        <button class="btn-action btn-delete" data-id="${aviso.id}">Excluir</button>
                    </td>
                `;
            });

            document.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', (e) => fillFormForEdit(parseInt(e.target.dataset.id)));
            });
            document.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', (e) => deleteAviso(parseInt(e.target.dataset.id)));
            });
        }

        function fillFormForEdit(id) {
            const aviso = avisosData.find(a => a.id === id);
            if (aviso) {
                avisoIdInput.value = aviso.id;
                tituloInput.value = aviso.titulo;
                descricaoInput.value = aviso.descricao;
                tagInput.value = aviso.tag;
                tipoAvisoSelect.value = aviso.tipo_aviso;
                linkRedirecionamentoInput.value = aviso.link_redirecionamento || '';
                
                selectIcon(aviso.caminho_icone || availableIcons[0]);
                
                if (aviso.data_expiracao) {
                    const date = new Date(aviso.data_expiracao);
                    selectedDay = date.getDate();
                    selectedMonth = date.getMonth();
                    selectedYear = date.getFullYear();
                    selectedHour = date.getHours();
                    selectedMinute = date.getMinutes();
                    updateDateTimeInputs();
                } else {
                    customDateInput.value = '';
                    customTimeInput.value = '';
                    dataExpiracaoIsoInput.value = '';
                }
                
                ativoCheckbox.checked = aviso.ativo;

                document.getElementById('aviso-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function clearForm() {
            avisoForm.reset();
            avisoIdInput.value = '';
            ativoCheckbox.checked = true;
            selectIcon(availableIcons[0]);
            customDateInput.value = '';
            customTimeInput.value = '';
            dataExpiracaoIsoInput.value = '';
            const now = new Date();
            selectedDay = now.getDate();
            selectedMonth = now.getMonth();
            selectedYear = now.getFullYear();
            selectedHour = now.getHours();
            selectedMinute = now.getMinutes() - (now.getMinutes() % 5);
        }

        avisoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = avisoIdInput.value ? parseInt(avisoIdInput.value) : null;
            
            const dataExpiracaoValue = dataExpiracaoIsoInput.value || null;

            const novoAviso = {
                titulo: tituloInput.value,
                descricao: descricaoInput.value,
                tag: tagInput.value,
                tipo_aviso: tipoAvisoSelect.value,
                caminho_icone: selectedIconPathInput.value,
                link_redirecionamento: linkRedirecionamentoInput.value || null,
                data_expiracao: dataExpiracaoValue, 
                ativo: ativoCheckbox.checked
            };

            if (id) {
                const index = avisosData.findIndex(a => a.id === id);
                if (index !== -1) {
                    avisosData[index] = { ...avisosData[index], ...novoAviso };
                    alert('Aviso atualizado com sucesso (simulado)!');
                }
            } else {
                const newId = avisosData.length > 0 ? Math.max(...avisosData.map(a => a.id)) + 1 : 1;
                avisosData.push({ id: newId, data_publicacao: new Date().toISOString(), ...novoAviso });
                alert('Aviso adicionado com sucesso (simulado)!');
            }

            renderAvisosTable();
            clearForm();
        });

        function deleteAviso(id) {
            if (confirm('Tem certeza que deseja excluir este aviso (simulado)?')) {
                avisosData = avisosData.filter(a => a.id !== id);
                renderAvisosTable();
                alert('Aviso excluído com sucesso (simulado)!');
                clearForm();
            }
        }

        openIconGalleryBtn.addEventListener('click', () => {
            iconGalleryModal.style.display = 'flex';
            renderIconGallery();
        });

        closeModalBtn.addEventListener('click', () => {
            iconGalleryModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === iconGalleryModal) {
                iconGalleryModal.style.display = 'none';
            }
            if (event.target.classList.contains('close-custom-modal-btn')) {
                if (event.target.dataset.modal === 'date') closeCustomDateModal();
                else if (event.target.dataset.modal === 'time') closeCustomTimeModal();
            }
        });

        btnClearForm.addEventListener('click', clearForm);

        customDateInput.addEventListener('click', openCustomDateModal);
        customTimeInput.addEventListener('click', openCustomTimeModal);

        document.getElementById('confirm-date-selection').addEventListener('click', () => {
            updateDateTimeInputs();
            closeCustomDateModal();
        });

        document.getElementById('confirm-time-selection').addEventListener('click', () => {
            selectedHour = parseInt(timePickerHour.value);
            selectedMinute = parseInt(timePickerMinute.value);
            updateDateTimeInputs();
            closeCustomTimeModal();
        });

        document.addEventListener('DOMContentLoaded', () => {
            renderAvisosTable();
            selectIcon(availableIcons[0]);
            const now = new Date();
            selectedDay = now.getDate();
            selectedMonth = now.getMonth();
            selectedYear = now.getFullYear();
            selectedHour = now.getHours();
            selectedMinute = now.getMinutes() - (now.getMinutes() % 5);
            updateDateTimeInputs();
        });