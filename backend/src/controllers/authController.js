// src/controllers/authController.js
const bcrypt = require('bcryptjs'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para JWTs
const dotenv = require('dotenv'); // Importa dotenv para garantir que JWT_SECRET seja carregado
dotenv.config(); // Carrega as variáveis de ambiente aqui também, por segurança

const authController = {};

// Função para o login do usuário
authController.login = async (req, res) => {
  const { email, senha } = req.body;

  console.log('DEBUG LOGIN: Tentativa de login para o email:', email);
  console.log('DEBUG LOGIN: Senha recebida (texto puro):', senha); // CUIDADO: Não logar senhas em produção! Apenas para depuração.

  try {
    // Acessa a instância do PrismaClient que foi setada no req.app
    const prisma = req.app.get('prisma');
    console.log('DEBUG LOGIN: Prisma instance available:', !!prisma);

    // 1. Buscar o usuário pelo email na tabela 'usuario'
    // Inclui a 'credencial_usuario' para verificar a senha
    const user = await prisma.usuario.findUnique({
      where: { email: email },
      include: {
        credencial_usuario: true
      }
    });

    console.log('DEBUG LOGIN: Usuário encontrado:', user ? user.email : 'Nenhum');

    // Se o usuário não for encontrado ou não tiver credencial
    if (!user || !user.credencial_usuario) {
      console.log('DEBUG LOGIN: Usuário não encontrado ou sem credencial.');
      return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
    }

    console.log('DEBUG LOGIN: Hash da senha do banco de dados:', user.credencial_usuario.hash_senha);

    // 2. Comparar a senha fornecida com o hash salvo no banco de dados
    const isMatch = await bcrypt.compare(senha, user.credencial_usuario.hash_senha);

    console.log('DEBUG LOGIN: Resultado da comparação de senha (isMatch):', isMatch);

    if (!isMatch) {
      console.log('DEBUG LOGIN: Senha não corresponde.');
      return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
    }

    // 3. Gerar um JSON Web Token (JWT)
    const JWT_SECRET = process.env.JWT_SECRET; // Lendo do .env
    console.log('DEBUG LOGIN: JWT_SECRET está definido:', !!JWT_SECRET); // Verifica se a secret está carregada
    
    if (!JWT_SECRET) {
        console.error('ERRO: JWT_SECRET não está definido nas variáveis de ambiente!');
        return res.status(500).json({ message: 'Erro de configuração do servidor: JWT_SECRET não encontrado.' });
    }

    const token = jwt.sign(
      { id_usuario: user.id_usuario, email: user.email, tipo_usuario: user.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

    console.log('DEBUG LOGIN: Token JWT gerado com sucesso.');

    // 4. Retornar o token e informações básicas do usuário
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token,
      user: {
        id_usuario: user.id_usuario,
        email: user.email,
        tipo_usuario: user.tipo_usuario
      }
    });

  } catch (error) {
    console.error('Erro no login (catch block):', error);
    res.status(500).json({ message: 'Erro interno do servidor durante o login.', error: error.message });
  }
};

module.exports = authController;
