// src/controllers/usuarioController.js
const bcrypt = require('bcryptjs'); // Para hash de senha

const usuarioController = {}; // Objeto que irá conter todas as funções do controlador

// Função para obter todos os usuários
usuarioController.getAllUsers = async (req, res) => {
  try {
    const prisma = req.app.get('prisma'); // Acessa a instância do PrismaClient
    console.log('DEBUG: Prisma instance in getAllUsers:', !!prisma); // Log para verificar se prisma existe
    const users = await prisma.usuario.findMany({
      // Inclui os detalhes da Pessoa e Credencial associadas ao usuário
      include: {
        pessoa: true, // Nome da relação no schema.prisma
        credencial_usuario: { // Nome da relação no schema.prisma
          select: { tipo_autenticacao: true, data_ultima_alteracao_senha: true }
        }
      }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Função para obter um usuário por ID
usuarioController.getUserById = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    console.log('DEBUG: Prisma instance in getUserById:', !!prisma); // Log para verificar se prisma existe
    const { id } = req.params;
    const user = await prisma.usuario.findUnique({ // findUnique para buscar por PK
      where: { id_usuario: parseInt(id) }, // Converte o ID da URL para inteiro
      include: {
        pessoa: true,
        credencial_usuario: { select: { tipo_autenticacao: true, data_ultima_alteracao_senha: true } }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Erro ao buscar usuário por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Função para criar um novo usuário e seu perfil específico (Cliente, Profissional, Proprietario)
usuarioController.createUser = async (req, res) => {
  const {
    email,
    tipo_usuario,
    senha, // Campo 'senha' do frontend
    nome_completo,
    celular,
    cpf,
    genero,
    foto_perfil,
    id_endereco,
    especializacao,
    biografia,
    observacoes,
    cnpj
  } = req.body;

  try {
    const prisma = req.app.get('prisma');
    console.log('DEBUG: Prisma instance in createUser:', !!prisma); // Log para verificar se prisma existe

    // HASH DA SENHA ANTES DE SALVAR
    const salt = await bcrypt.genSalt(10);
    const hash_senha = await bcrypt.hash(senha, salt);

    // Inicia uma transação Prisma para garantir atomicidade
    const result = await prisma.$transaction(async (t) => {
      // 1. Criar o Usuário e INCLUIR a Pessoa e Credencial na mesma operação
      const newUser = await t.usuario.create({
        data: { // 'data' é obrigatório no Prisma para criação
          email,
          tipo_usuario,
          credencial_usuario: { // Conecta credencial na criação do usuário
            create: { hash_senha: hash_senha }
          },
          pessoa: { // Conecta pessoa na criação do usuário
            create: {
              nome_completo,
              celular,
              cpf,
              genero,
              foto_perfil,
              id_endereco: id_endereco ? parseInt(id_endereco) : null, // Converte para Int se existir
            }
          }
        },
        include: { // Garante que os objetos relacionados sejam retornados para acesso posterior na transação
          pessoa: true,
          credencial_usuario: true
        }
      });

      // 4. Criar o perfil específico (Cliente, Profissional ou Proprietario)
      // Acessa o id_pessoa do objeto 'pessoa' que foi incluído na criação do usuário
      if (tipo_usuario === 'cliente') {
        await t.cliente.create({
          data: {
            id_pessoa: newUser.pessoa.id_pessoa, // Acessa o ID da pessoa criada
            nivel_fidelidade: 'bronze', // Padrão inicial
            pontos_fidelizacao: 0
          }
        });
      } else if (tipo_usuario === 'profissional') {
        if (!especializacao) {
          throw new Error('Especialização é obrigatória para profissionais.');
        }
        await t.profissional.create({
          data: {
            id_pessoa: newUser.pessoa.id_pessoa,
            especializacao,
            biografia,
            observacoes
          }
        });
      } else if (tipo_usuario === 'proprietario') {
        if (!cnpj) {
          throw new Error('CNPJ é obrigatório para proprietários.');
        }
        await t.proprietario.create({
          data: {
            id_pessoa: newUser.pessoa.id_pessoa,
            cnpj
          }
        });
      } else {
        throw new Error('Tipo de usuário inválido.');
      }

      return newUser; // Retorna o objeto do novo usuário criado
    });

    res.status(201).json({ message: 'Usuário e perfil criados com sucesso!', user: result });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    // Erros de validação (ex: email duplicado) ou do DB serão capturados aqui
    res.status(500).json({
      message: 'Erro ao criar usuário.',
      error: error.message,
      details: error.meta ? error.meta.cause : undefined // Detalhes de erro do Prisma
    });
  }
};

// Função para atualizar um usuário
usuarioController.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    email, tipo_usuario, senha, // 'senha' é o campo para nova senha, se fornecida
    nome_completo, celular, cpf, genero, foto_perfil, id_endereco,
    especializacao, biografia, observacoes, cnpj
  } = req.body;

  try {
    const prisma = req.app.get('prisma');
    console.log('DEBUG: Prisma instance in updateUser:', !!prisma); // Log para verificar se prisma existe

    const result = await prisma.$transaction(async (t) => {
      // Encontrar o usuário existente e incluir suas relações para atualização
      const user = await t.usuario.findUnique({
        where: { id_usuario: parseInt(id) },
        include: { pessoa: true, credencial_usuario: true }
      });

      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      // 1. Atualizar dados do Usuário
      await t.usuario.update({
        where: { id_usuario: user.id_usuario },
        data: { email, tipo_usuario }
      });

      // 2. Atualizar dados da Pessoa associada (se existir e dados forem fornecidos)
      if (user.pessoa) {
        await t.pessoa.update({
          where: { id_pessoa: user.pessoa.id_pessoa },
          data: {
            nome_completo,
            celular,
            cpf,
            genero,
            foto_perfil,
            id_endereco: id_endereco ? parseInt(id_endereco) : null,
          }
        });
      }

      // 3. Atualizar hash da senha na Credencial (se uma nova senha for fornecida)
      if (senha) {
        const hashedSenha = await bcrypt.hash(senha, await bcrypt.genSalt(10));
        if (user.credencial_usuario) {
          await t.credencial_usuario.update({
            where: { id_credencial: user.credencial_usuario.id_credencial },
            data: { hash_senha: hashedSenha }
          });
        }
      }

      // 4. Lógica de atualização para perfis específicos (Cliente, Profissional, Proprietario)
      // Verifica o tipo_usuario atual e atualiza o perfil correspondente
      if (tipo_usuario === 'cliente' && user.pessoa) {
        const cliente = await t.cliente.findUnique({ where: { id_pessoa: user.pessoa.id_pessoa } });
        if (cliente) {
          await t.cliente.update({
            where: { id_cliente: cliente.id_cliente },
            data: {
              nivel_fidelidade: req.body.nivel_fidelidade, // Exemplo de campo específico
              pontos_fidelizacao: req.body.pontos_fidelizacao
            }
          });
        }
      } else if (tipo_usuario === 'profissional' && user.pessoa) {
        const profissional = await t.profissional.findUnique({ where: { id_pessoa: user.pessoa.id_pessoa } });
        if (profissional) {
          await t.profissional.update({
            where: { id_profissional: profissional.id_profissional },
            data: { especializacao, biografia, observacoes }
          });
        }
      } else if (tipo_usuario === 'proprietario' && user.pessoa) {
        const proprietario = await t.proprietario.findUnique({ where: { id_pessoa: user.pessoa.id_pessoa } });
        if (proprietario) {
          await t.proprietario.update({
            where: { id_proprietario: proprietario.id_proprietario },
            data: { cnpj }
          });
        }
      }

      return user; // Retorna o usuário (com dados possivelmente desatualizados, mas a operação foi feita)
    });

    res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: result });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message, details: error.meta ? error.meta.cause : undefined });
  }
};

// Função para deletar um usuário
usuarioController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const prisma = req.app.get('prisma');
    console.log('DEBUG: Prisma instance in deleteUser:', !!prisma); // Log para verificar se prisma existe

    const result = await prisma.$transaction(async (t) => {
      const user = await t.usuario.findUnique({
        where: { id_usuario: parseInt(id) },
        include: { pessoa: true, credencial_usuario: true } // Inclui para deletar filhos
      });

      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      // 1. Deletar Credencial (se existir)
      if (user.credencial_usuario) {
        await t.credencial_usuario.delete({ where: { id_credencial: user.credencial_usuario.id_credencial } });
      }

      // 2. Deletar Perfis específicos (Cliente, Profissional, Proprietario) e Pessoa (se existir)
      if (user.pessoa) {
        // Usar deleteMany para garantir que a operação seja executada mesmo se não encontrar um único registro
        await t.cliente.deleteMany({ where: { id_pessoa: user.pessoa.id_pessoa } });
        await t.profissional.deleteMany({ where: { id_pessoa: user.pessoa.id_pessoa } });
        await t.proprietario.deleteMany({ where: { id_pessoa: user.pessoa.id_pessoa } });
        // Deletar a Pessoa
        await t.pessoa.delete({ where: { id_pessoa: user.pessoa.id_pessoa } });
      }

      // 3. Deletar o próprio Usuário
      await t.usuario.delete({ where: { id_usuario: user.id_usuario } });

      return { message: 'Usuário deletado com sucesso.' };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário.', error: error.message, details: error.meta ? error.meta.cause : undefined });
  }
};

usuarioController.getAllProfessionals = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const usuariosProfissionais = await prisma.usuario.findMany({
      where: {
        tipo_usuario: 'profissional',
        ativo: true
      },
      select: {
        id_usuario: true,
        email: true,
        pessoa: {
          select: {
            nome_completo: true,
            foto_perfil: true,
            // Acessamos o modelo 'profissional' através da relação em 'pessoa'
            profissional: {
              select: {
                id_profissional: true, // Importante para a agenda
                especializacao: true
              }
            }
          }
        }
      }
    });

    // Formatamos a resposta para ser mais fácil de usar no frontend
    const profissionaisFormatados = usuariosProfissionais.map(user => {
      // O resultado de 'profissional' é um array, pois a relação é 1-para-muitos
      // Pegamos o primeiro (e único) perfil profissional associado à pessoa
      const perfilProfissional = user.pessoa?.profissional[0];

      return {
        id_usuario: user.id_usuario,
        id_profissional: perfilProfissional?.id_profissional,
        nome: user.pessoa?.nome_completo,
        foto_perfil: user.pessoa?.foto_perfil,
        especializacao: perfilProfissional?.especializacao
      };
    }).filter(p => p.id_profissional); // Garante que apenas usuários com perfil profissional sejam listados

    res.status(200).json(profissionaisFormatados);

  } catch (error) {
    console.error('Erro ao buscar profissionais:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};


// Função para atualizar a foto de perfil (versão limpa e correta)
usuarioController.updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem foi enviado.' });
    }
    const filePath = req.file.path.replace(/\\/g, '/');
    const prisma = req.app.get('prisma');
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { pessoa: { select: { id_pessoa: true } } }
    });
    if (!usuario || !usuario.pessoa || !usuario.pessoa.id_pessoa) {
      return res.status(404).json({ message: 'Pessoa associada ao usuário não encontrada.' });
    }
    const pessoaAtualizada = await prisma.pessoa.update({
      where: { id_pessoa: usuario.pessoa.id_pessoa },
      data: { foto_perfil: `/${filePath}` }
    });
    res.status(200).json({
      message: 'Foto de perfil atualizada com sucesso!',
      foto_perfil: pessoaAtualizada.foto_perfil
    });
  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar a foto.', error: error.message });
  }
};

// Função para atualizar a foto de capa (versão limpa e correta)
usuarioController.updateCoverPhoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem foi enviado.' });
    }
    const filePath = req.file.path.replace(/\\/g, '/');
    const prisma = req.app.get('prisma');
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { pessoa: { select: { id_pessoa: true } } }
    });
    if (!usuario || !usuario.pessoa || !usuario.pessoa.id_pessoa) {
      return res.status(404).json({ message: 'Pessoa associada ao usuário não encontrada.' });
    }
    const pessoaAtualizada = await prisma.pessoa.update({
      where: { id_pessoa: usuario.pessoa.id_pessoa },
      data: { foto_capa: `/${filePath}` }
    });
    res.status(200).json({
      message: 'Foto de capa atualizada com sucesso!',
      foto_capa: pessoaAtualizada.foto_capa
    });
  } catch (error) {
    console.error('Erro ao atualizar foto de capa:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar a foto.', error: error.message });
  }
};



// Adicione esta função dentro de src/controllers/usuarioController.js

// Função para atualizar a foto de perfil
usuarioController.updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem foi enviado.' });
    }

    // O caminho do arquivo salvo pelo multer. Ex: 'uploads/profiles/user-1-1678886400000.png'
    const filePath = req.file.path;

    const prisma = req.app.get('prisma');

    // Precisamos encontrar o 'id_pessoa' associado ao nosso 'id_usuario'
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { id_pessoa: true }
    });

    if (!usuario || !usuario.id_pessoa) {
      return res.status(404).json({ message: 'Pessoa associada ao usuário não encontrada.' });
    }

    // Atualiza o campo 'foto_perfil' na tabela 'pessoa'
    const pessoaAtualizada = await prisma.pessoa.update({
      where: { id_pessoa: usuario.id_pessoa },
      data: { foto_perfil: `/${filePath}` } // Salva o caminho com uma barra inicial
    });

    res.status(200).json({
      message: 'Foto de perfil atualizada com sucesso!',
      foto_perfil: pessoaAtualizada.foto_perfil
    });

  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar a foto.', error: error.message });
  }
};


// Adicione ou substitua esta função em src/controllers/usuarioController.js

// Função para atualizar a foto de perfil
usuarioController.updateProfilePhoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem foi enviado.' });
    }

    // Pega o caminho do arquivo salvo e normaliza as barras para o padrão web (/)
    const filePath = req.file.path.replace(/\\/g, '/');

    const prisma = req.app.get('prisma');

    // =====================================================================
    // AQUI ESTÁ A CORREÇÃO PRINCIPAL
    // Buscamos o usuário e incluímos a relação 'pessoa' para pegar o id_pessoa
    // =====================================================================
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: {
        pessoa: {
          select: { id_pessoa: true }
        }
      }
    });

    // Agora, acessamos o id_pessoa através de 'usuario.pessoa.id_pessoa'
    if (!usuario || !usuario.pessoa || !usuario.pessoa.id_pessoa) {
      return res.status(404).json({ message: 'Pessoa associada ao usuário não encontrada.' });
    }

    // Atualiza o campo 'foto_perfil' na tabela 'pessoa'
    const pessoaAtualizada = await prisma.pessoa.update({
      where: { id_pessoa: usuario.pessoa.id_pessoa },
      data: { foto_perfil: `/${filePath}` } // Salva o caminho com uma barra inicial
    });

    res.status(200).json({
      message: 'Foto de perfil atualizada com sucesso!',
      foto_perfil: pessoaAtualizada.foto_perfil
    });

  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar a foto.', error: error.message });
  }
};


// Função para atualizar a foto de capa
usuarioController.updateCoverPhoto = async (req, res) => {
  try {
    const userId = req.user.id_usuario;

    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo de imagem foi enviado.' });
    }
    const filePath = req.file.path.replace(/\\/g, '/');
    const prisma = req.app.get('prisma');

    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: userId },
      select: { pessoa: { select: { id_pessoa: true } } }
    });

    if (!usuario || !usuario.pessoa || !usuario.pessoa.id_pessoa) {
      return res.status(404).json({ message: 'Pessoa associada ao usuário não encontrada.' });
    }

    // Atualiza o novo campo 'foto_capa' na tabela 'pessoa'
    const pessoaAtualizada = await prisma.pessoa.update({
      where: { id_pessoa: usuario.pessoa.id_pessoa },
      data: { foto_capa: `/${filePath}` } // Salva o caminho da foto de capa
    });

    res.status(200).json({
      message: 'Foto de capa atualizada com sucesso!',
      foto_capa: pessoaAtualizada.foto_capa
    });

  } catch (error) {
    console.error('Erro ao atualizar foto de capa:', error);
    res.status(500).json({ message: 'Erro interno ao atualizar a foto.', error: error.message });
  }
};

module.exports = usuarioController;
