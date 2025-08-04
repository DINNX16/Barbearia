// src/controllers/authController.js
const bcrypt = require('bcryptjs'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para JWTs
const dotenv = require('dotenv');
dotenv.config(); // Garante que JWT_SECRET seja carregado

const authController = {};

// Função para o login do usuário
authController.login = async (req, res) => {
  const { email, senha } = req.body;

  console.log('DEBUG LOGIN: Tentativa de login para o email:', email);

  try {
    const prisma = req.app.get('prisma');
    const user = await prisma.usuario.findUnique({
      where: { email: email },
      include: {
        credencial_usuario: true
      }
    });

    if (!user || !user.credencial_usuario) {
      console.log('DEBUG LOGIN: Usuário não encontrado ou sem credencial.');
      return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
    }

    const isMatch = await bcrypt.compare(senha, user.credencial_usuario.hash_senha);

    if (!isMatch) {
      console.log('DEBUG LOGIN: Senha não corresponde.');
      return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error('ERRO: JWT_SECRET não está definido nas variáveis de ambiente!');
        return res.status(500).json({ message: 'Erro de configuração do servidor: JWT_SECRET não encontrado.' });
    }

    // --- LOGS ADICIONAIS PARA DEPURAR O JWT ---
    const jwtPayload = { 
      id_usuario: user.id_usuario, 
      email: user.email, 
      tipo_usuario: user.tipo_usuario 
    };
    console.log('DEBUG LOGIN: Payload do JWT sendo criado:', jwtPayload);
    // --- FIM DOS LOGS ADICIONAIS ---

    const token = jwt.sign(
      jwtPayload,
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('DEBUG LOGIN: Token JWT gerado com sucesso.');

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

authController.getProfile = async (req, res) => {
  console.log('DEBUG: Acedendo à rota /perfil');
  try {
    const prisma = req.app.get('prisma');
    // O ID do usuário é extraído do token pelo middleware verifyToken e anexado a req.user
    const userId = req.user.id_usuario;

    if (!userId) {
      // Esta verificação é uma segurança extra
      return res.status(400).json({ message: 'ID do usuário não encontrado no token.' });
    }

    // Busca o usuário no banco de dados, selecionando campos específicos e seguros
    const userProfile = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        email: true,
        tipo_usuario: true,
        pessoa: { // Inclui dados da tabela 'pessoa' relacionada
          select: {
            nome_completo: true,
            foto_perfil: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Envia os dados do perfil como resposta
    res.status(200).json({
        message: 'Perfil recuperado com sucesso!',
        user: userProfile 
    });

  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
  }
};


module.exports = authController;
