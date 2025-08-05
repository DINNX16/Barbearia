// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authController = {};

// A função de login permanece a mesma
authController.login = async (req, res) => {
  // ... seu código de login existente, sem alterações ...
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

    const jwtPayload = {
      id_usuario: user.id_usuario,
      email: user.email,
      tipo_usuario: user.tipo_usuario
    };
    console.log('DEBUG LOGIN: Payload do JWT sendo criado:', jwtPayload);

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


// =============================================================
// FUNÇÃO getProfile CORRIGIDA PARA EVITAR O CRASH
// =============================================================
authController.getProfile = async (req, res) => {
  console.log('DEBUG: Acedendo à rota /perfil');
  try {
    const prisma = req.app.get('prisma');
    const userId = req.user.id_usuario;

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não encontrado no token.' });
    }

    const userProfile = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        id_usuario: true,
        email: true,
        tipo_usuario: true,
        pessoa: {
          select: {
            id_pessoa: true,
            nome_completo: true,
            foto_perfil: true,
            foto_capa: true,
          },
        },
      },
    });

    if (!userProfile) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (userProfile.tipo_usuario === 'profissional' && userProfile.pessoa) {

      // =====================================================================
      // AQUI ESTÁ A CORREÇÃO: Usamos 'findFirst' em vez de 'findUnique'.
      // 'findFirst' é mais seguro se o campo 'id_pessoa' não for estritamente único.
      // =====================================================================
      const detalhesProfissional = await prisma.profissional.findFirst({
        where: { id_pessoa: userProfile.pessoa.id_pessoa },
        select: {
          id_profissional: true,
          especializacao: true,
          biografia: true,
        }
      });

      // Adicionamos uma verificação extra para garantir que 'detalhesProfissional' foi encontrado
      if (detalhesProfissional) {
        const agendamentos = await prisma.agendamento.findMany({
          where: { id_profissional: detalhesProfissional.id_profissional },
          select: {
            data_hora_inicio: true,
            status: true,
            cliente: {
              select: {
                pessoa: {
                  select: { nome_completo: true }
                }
              }
            }
          },
          orderBy: { data_hora_inicio: 'desc' }
        });

        userProfile.detalhesProfissional = detalhesProfissional;
        userProfile.agendamentos = agendamentos;
      }
    }

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