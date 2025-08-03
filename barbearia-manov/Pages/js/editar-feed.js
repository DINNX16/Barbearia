// Garante que o script só roda depois que o HTML da página estiver completamente carregado.
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. REFERÊNCIAS AOS ELEMENTOS DO FORMULÁRIO ---
    // Pegamos todos os campos do formulário para podermos ler e alterar os seus valores.
    const form = document.getElementById('feed-editor-form');

    // Campos da Biografia
    const bioTituloInput = document.getElementById('bio-titulo');
    const bioTextoInput = document.getElementById('bio-texto');
    const bioImagemInput = document.getElementById('bio-imagem');

    // Campos do Carrossel
    const carouselCard1TituloInput = document.getElementById('carousel-card1-titulo');
    const carouselCard1TextoInput = document.getElementById('carousel-card1-texto');
    const carouselCard1ImagemInput = document.getElementById('carousel-card1-imagem');

    const carouselCard2TituloInput = document.getElementById('carousel-card2-titulo');
    const carouselCard2TextoInput = document.getElementById('carousel-card2-texto');
    const carouselCard2ImagemInput = document.getElementById('carousel-card2-imagem');

    const carouselCard3TituloInput = document.getElementById('carousel-card3-titulo');
    const carouselCard3TextoInput = document.getElementById('carousel-card3-texto');
    const carouselCard3ImagemInput = document.getElementById('carousel-card3-imagem');

    const carouselCard4TituloInput = document.getElementById('carousel-card4-titulo');
    const carouselCard4TextoInput = document.getElementById('carousel-card4-texto');
    const carouselCard4ImagemInput = document.getElementById('carousel-card4-imagem');

    // Campo das Avaliações
    const avaliacoesTituloInput = document.getElementById('avaliacoes-titulo');


    // --- 2. DADOS PADRÃO ---
    // Objeto com os valores originais da tua página.
    // Usado na primeira vez que a página de edição é aberta.
    const dadosPadrao = {
        bioTitulo: "Barbearia Manóv",
        bioTexto: "A Barbearia Manov nasceu da paixão por proporcionar uma experiência única de cuidado e estilo. Fundada com o objetivo de oferecer um serviço de qualidade, nosso espaço combina o melhor do atendimento personalizado com um ambiente descontraído e moderno.",
        bioImagem: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/biografia.png",
        carouselCard1: {
            titulo: "Cortes Modernos",
            texto: "Do clássico ao contemporâneo, encontre o estilo que mais combina com você.",
            imagem: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/jovem.png"
        },
        carouselCard2: {
            titulo: "Barba Terapia",
            texto: "Tratamento completo com toalhas quentes, óleos e massagem facial.",
            imagem: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/barba-terapia.png"
        },
        carouselCard3: {
            titulo: "Produtos Premium",
            texto: "As melhores marcas de pomadas, óleos e balms para o seu cuidado diário.",
            imagem: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/produto.png"
        },
        carouselCard4: {
            titulo: "Ambiente Exclusivo",
            texto: "Um lugar para relaxar, tomar uma cerveja e cuidar do visual com estilo.",
            imagem: "https://raw.githubusercontent.com/DINNX16/Barbearia/main/barbearia-manov/assets/ambiente-barbearia.png"
        },
        avaliacoesTitulo: "Avaliações dos Clientes"
    };


    // --- 3. FUNÇÃO PARA CARREGAR OS DADOS NO FORMULÁRIO ---
    function carregarDados() {
        // Tenta obter os dados guardados no localStorage. A chave é 'feedData'.
        const dadosSalvos = localStorage.getItem('feedData');
        let dadosAtuais;

        if (dadosSalvos) {
            // Se encontrou dados, converte a string JSON de volta para um objeto.
            dadosAtuais = JSON.parse(dadosSalvos);
        } else {
            // Se não encontrou nada, usa os dados padrão.
            dadosAtuais = dadosPadrao;
        }

        // Preenche cada campo do formulário com os dados carregados.
        bioTituloInput.value = dadosAtuais.bioTitulo;
        bioTextoInput.value = dadosAtuais.bioTexto;
        bioImagemInput.value = dadosAtuais.bioImagem;

        carouselCard1TituloInput.value = dadosAtuais.carouselCard1.titulo;
        carouselCard1TextoInput.value = dadosAtuais.carouselCard1.texto;
        carouselCard1ImagemInput.value = dadosAtuais.carouselCard1.imagem;

        carouselCard2TituloInput.value = dadosAtuais.carouselCard2.titulo;
        carouselCard2TextoInput.value = dadosAtuais.carouselCard2.texto;
        carouselCard2ImagemInput.value = dadosAtuais.carouselCard2.imagem;

        carouselCard3TituloInput.value = dadosAtuais.carouselCard3.titulo;
        carouselCard3TextoInput.value = dadosAtuais.carouselCard3.texto;
        carouselCard3ImagemInput.value = dadosAtuais.carouselCard3.imagem;

        carouselCard4TituloInput.value = dadosAtuais.carouselCard4.titulo;
        carouselCard4TextoInput.value = dadosAtuais.carouselCard4.texto;
        carouselCard4ImagemInput.value = dadosAtuais.carouselCard4.imagem;

        avaliacoesTituloInput.value = dadosAtuais.avaliacoesTitulo;
    }


    // --- 4. FUNÇÃO PARA SALVAR OS DADOS DO FORMULÁRIO ---
    function salvarDados(event) {
        // Impede que o formulário recarregue a página, que é o comportamento padrão.
        event.preventDefault();

        // Cria um novo objeto com os valores atuais dos campos do formulário.
        const novosDados = {
            bioTitulo: bioTituloInput.value,
            bioTexto: bioTextoInput.value,
            bioImagem: bioImagemInput.value,
            carouselCard1: {
                titulo: carouselCard1TituloInput.value,
                texto: carouselCard1TextoInput.value,
                imagem: carouselCard1ImagemInput.value
            },
            carouselCard2: {
                titulo: carouselCard2TituloInput.value,
                texto: carouselCard2TextoInput.value,
                imagem: carouselCard2ImagemInput.value
            },
            carouselCard3: {
                titulo: carouselCard3TituloInput.value,
                texto: carouselCard3TextoInput.value,
                imagem: carouselCard3ImagemInput.value
            },
            carouselCard4: {
                titulo: carouselCard4TituloInput.value,
                texto: carouselCard4TextoInput.value,
                imagem: carouselCard4ImagemInput.value
            },
            avaliacoesTitulo: avaliacoesTituloInput.value
        };

        // Converte o objeto para uma string no formato JSON.
        const dadosEmString = JSON.stringify(novosDados);
        // Guarda a string no localStorage com a chave 'feedData'.
        localStorage.setItem('feedData', dadosEmString);

        // Avisa o utilizador que tudo correu bem.
        alert('Alterações salvas com sucesso!');
    }


    // --- 5. INICIALIZAÇÃO ---
    // Adiciona o "ouvinte" ao formulário. A função salvarDados será chamada quando o formulário for submetido (botão "Salvar").
    form.addEventListener('submit', salvarDados);

    // Chama a função para carregar os dados assim que a página é aberta.
    carregarDados();

});