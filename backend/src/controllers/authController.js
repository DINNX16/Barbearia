// src/controllers/authController.js
const bcrypt = require('bcryptjs'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para JWTs

const authController = {};

// Função para o login do usuário
authController.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Acessa a instância do PrismaClient que foi setada no req.app
    const prisma = req.app.get('prisma'); // <<<< MUDANÇA AQUI: de models para prisma

    // 1. Buscar o usuário pelo email na tabela 'usuario'
    // Inclui a 'credencial_usuario' para verificar a senha
    const user = await prisma.usuario.findUnique({ // <<<< MUDANÇA AQUI: findUnique em vez de findOne
      where: { email: email },
      include: {
        credencial_usuario: true // <<<< MUDANÇA AQUI: nome da relação no schema.prisma
      }
    });

    // Se o usuário não for encontrado ou não tiver credencial
    if (!user || !user.credencial_usuario) { // <<<< MUDANÇA AQUI: user.credencial_usuario
      return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
    }

    // 2. Comparar a senha fornecida com o hash salvo no banco de dados
    const isMatch = await bcrypt.compare(senha, user.credencial_usuario.hash_senha); // <<<< MUDANÇA AQUI: user.credencial_usuario.hash_senha

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas: Email ou senha incorretos.' });
    }

    // 3. Gerar um JSON Web Token (JWT)
    const JWT_SECRET = process.env.JWT_SECRET; // Lendo do .env
    const token = jwt.sign(
      { id_usuario: user.id_usuario, email: user.email, tipo_usuario: user.tipo_usuario },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expira em 1 hora
    );

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
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor durante o login.', error: error.message });
  }
};

module.exports = authController;
