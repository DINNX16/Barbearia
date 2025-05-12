# Barbearia Online ✂️
Este projeto é um sistema completo para barbearias que inclui autenticação de usuários, catálogo de produtos/serviços, agendamento online e um feed interativo para promoções. Os usuários podem agendar serviços, comprar produtos e interagir com postagens.

## Estrutura do Projeto

```
barbearia-website/  
├── src/  
│   ├── index.html                  # Página principal (com animação de carregamento)  
│   ├── pages/  
│   │   ├── agenda.html             # Agendamento de horários  
│   │   ├── vitrine/                # Catálogo de produtos  
│   │   │   ├── acessorios.html  
│   │   │   ├── ferramentas.html  
│   │   │   └── produtos.html  
│   │   ├── servicos/               # Serviços oferecidos  
│   │   │   ├── cortes.html  
│   │   │   ├── barbas.html  
│   │   │   ├── sobrancelhas.html  
│   │   │   └── cursos.html         # Página de cursos profissionalizantes  
│   │   └── perfil.html             # Área do usuário (histórico e dados)  
│   ├── styles/  
│   │   ├── style.css               # Estilos globais  
│   │   ├── components/             # CSS modularizado  
│   │   │   ├── auth.css           # Estilos para login/cadastro  
│   │   │   ├── feed.css           # Estilos do feed de postagens  
│   │   │   └── ecommerce.css      # Estilos da vitrine  
│   ├── scripts/  
│   │   ├── app.js                 # Lógica principal  
│   │   ├── auth.js                # Autenticação (login/logout)  
│   │   ├── agenda.js              # Lógica de agendamento  
│   │   └── ecommerce.js           # Carrinho e checkout  
│   └── assets/  
│       ├── images/  
│       │   ├── produtos/          # Imagens dos produtos  
│       │   ├── servicos/          # Fotos dos serviços  
│       │   └── usuarios/          # Avatares de perfil  
│       ├── videos/                # Vídeos demonstrativos  
│       └── fonts/                 # Fontes customizadas  
├── README.md                      # Este arquivo  
└── .gitignore                     # Arquivos ignorados pelo Git  
```
.....................
## ⚙️ Funcionalidades
🔐 Autenticação
Login/Logout: Acesso seguro à conta.

Cadastro: Criação de perfil com foto e dados pessoais.

Recuperação de senha: Via e-mail ou SMS.

## 🛒 E-commerce
Vitrine: Produtos organizados por categorias (acessórios, ferramentas, etc.).

Carrinho: Adição/remoção de itens antes do checkout.

Pagamento: Integração com PIX, cartão e outros métodos.

## 📅 Agendamento
Seleção de serviços: Corte, barba, sobrancelhas.

Calendário interativo: Escolha de horários disponíveis.

## 📢 Feed Dinâmico
Postagens: Promoções, eventos e avisos.

Interação: Curtidas e comentários em postagens.

## 👤 Perfil do Usuário
Histórico: Serviços agendados e compras realizadas.

Avaliações: Feedback sobre serviços/produtos.

## 🛠️ Como Configurar
Clone o repositório:

bash
Copy
git clone https://github.com/seu-usuario/barbearia-website.git  
Execute o projeto:

Abra o arquivo src/index.html em um navegador.

Para funcionalidades completas (como autenticação), configure um servidor local (ex: Live Server no VSCode).

Dependências:

Nenhuma dependência externa é necessária para a versão estática.

## 🤝 Contribuições
Contribuições são bem-vindas! Siga estes passos:

Faça um fork do projeto.

Crie uma branch com sua feature (git checkout -b feature/nova-funcionalidade).

Envie um pull request.

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.
