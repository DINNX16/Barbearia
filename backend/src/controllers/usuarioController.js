// src/controllers/usuarioController.js

const usuarioController = {};

// Função para obter todos os usuários
usuarioController.getAllUsers = async (req, res) => {
  try {
    const models = req.app.get('models');
    const users = await models.Usuario.findAll({
      // Inclui os detalhes da Pessoa e Credencial associadas ao usuário
      include: [
        { model: models.Pessoa, as: 'detalhesPessoais' },
        { model: models.CredencialUsuario, as: 'credencial', attributes: ['tipo_autenticacao', 'data_ultima_alteracao_senha'] } // Não inclua hash_senha por segurança
      ]
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
    const models = req.app.get('models');
    const { id } = req.params;
    const user = await models.Usuario.findByPk(id, {
      include: [
        { model: models.Pessoa, as: 'detalhesPessoais' },
        { model: models.CredencialUsuario, as: 'credencial', attributes: ['tipo_autenticacao', 'data_ultima_alteracao_senha'] }
      ]
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
  // Dados recebidos do corpo da requisição
  // IMPORTANTE: O frontend deve enviar todos esses campos necessários no JSON do corpo.
  const {
    email,
    tipo_usuario,       // 'cliente', 'profissional', 'proprietario'
    hash_senha,         // Senha (será hasheada em um app real)
    nome_completo,
    celular,
    cpf,                // Opcional para Pessoa, mas necessário para perfis específicos em alguns cenários
    genero,             // Opcional para Pessoa
    foto_perfil,        // Opcional para Pessoa
    id_endereco,        // Opcional para Pessoa (FK para a tabela Endereco geral)

    // Campos específicos para Profissional (se tipo_usuario for 'profissional')
    especializacao,
    biografia,
    observacoes,

    // Campos específicos para Proprietario (se tipo_usuario for 'proprietario')
    cnpj
  } = req.body;

  try {
    const models = req.app.get('models');
    const result = await models.sequelize.transaction(async (t) => {
      // 1. Criar o Usuário
      const newUser = await models.Usuario.create({
        email,
        tipo_usuario, // Pega o tipo_usuario do body
      }, { transaction: t });

      // 2. Criar a Credencial do Usuário
      // Em produção, a senha DEVE ser hasheada (ex: com bcryptjs) antes de salvar!
      await models.CredencialUsuario.create({
        id_usuario: newUser.id_usuario,
        hash_senha: hash_senha
      }, { transaction: t });

      // 3. Criar a Pessoa associada ao usuário, com todos os campos disponíveis
      const newPessoa = await models.Pessoa.create({
        id_usuario: newUser.id_usuario,
        nome_completo,
        celular,
        cpf,
        genero,
        foto_perfil,
        id_endereco, // Pode ser null se não houver um id_endereco geral
      }, { transaction: t });

      // 4. Criar o perfil específico (Cliente, Profissional ou Proprietario)
      if (tipo_usuario === 'cliente') {
        await models.Cliente.create({
          id_pessoa: newPessoa.id_pessoa,
          nivel_fidelidade: 'bronze', // Padrão inicial
          pontos_fidelizacao: 0
        }, { transaction: t });
      } else if (tipo_usuario === 'profissional') {
        // Validação básica para campos obrigatórios de profissional
        if (!especializacao) {
          throw new Error('Especialização é obrigatória para profissionais.');
        }
        await models.Profissional.create({
          id_pessoa: newPessoa.id_pessoa,
          especializacao,
          biografia,
          observacoes
        }, { transaction: t });
      } else if (tipo_usuario === 'proprietario') {
        // Validação básica para campos obrigatórios de proprietario
        if (!cnpj) {
          throw new Error('CNPJ é obrigatório para proprietários.');
        }
        await models.Proprietario.create({
          id_pessoa: newPessoa.id_pessoa,
          cnpj
        }, { transaction: t });
      } else {
        throw new Error('Tipo de usuário inválido.');
      }

      return newUser; // Retorna o objeto do novo usuário criado
    });

    res.status(201).json({ message: 'Usuário e perfil criados com sucesso!', user: result });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({
      message: 'Erro ao criar usuário.',
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : undefined
    });
  }
};

// Função para atualizar um usuário (apenas os dados do Usuario, Pessoa e Credencial se necessário)
usuarioController.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    email, tipo_usuario, hash_senha,
    nome_completo, celular, cpf, genero, foto_perfil, id_endereco,
    especializacao, biografia, observacoes, cnpj
  } = req.body;

  try {
    const models = req.app.get('models');
    const result = await models.sequelize.transaction(async (t) => {
      const user = await models.Usuario.findByPk(id, { transaction: t });
      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      await user.update({ email, tipo_usuario }, { transaction: t });

      const pessoa = await models.Pessoa.findOne({ where: { id_usuario: user.id_usuario }, transaction: t });
      if (pessoa) {
        await pessoa.update({
          nome_completo,
          celular,
          cpf,
          genero,
          foto_perfil,
          id_endereco
        }, { transaction: t });
      }

      if (hash_senha) {
        const credencial = await models.CredencialUsuario.findOne({ where: { id_usuario: user.id_usuario }, transaction: t });
        if (credencial) {
          await credencial.update({ hash_senha }, { transaction: t });
        }
      }

      // Lógica de atualização para Cliente, Profissional, Proprietario (exemplo, pode ser mais complexa)
      if (tipo_usuario === 'cliente') {
        const cliente = await models.Cliente.findOne({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
        if (cliente) {
          // Atualiza campos específicos do cliente se existirem no body (ex: nivel_fidelidade, pontos_fidelizacao)
          await cliente.update(req.body, { transaction: t });
        }
      } else if (tipo_usuario === 'profissional') {
        const profissional = await models.Profissional.findOne({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
        if (profissional) {
          await profissional.update({ especializacao, biografia, observacoes }, { transaction: t });
        }
      } else if (tipo_usuario === 'proprietario') {
        const proprietario = await models.Proprietario.findOne({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
        if (proprietario) {
          await proprietario.update({ cnpj }, { transaction: t });
        }
      }


      return user;
    });

    res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: result });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
};

// Função para deletar um usuário
usuarioController.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const models = req.app.get('models');
    const result = await models.sequelize.transaction(async (t) => {
      const user = await models.Usuario.findByPk(id, { transaction: t });
      if (!user) {
        throw new Error('Usuário não encontrado.');
      }

      // Deleta primeiro os registros de CredencialUsuario, Pessoa e seus filhos (Cliente, Profissional, Proprietario)
      // para evitar problemas de FK se onDelete não for 'CASCADE' nos modelos Sequelize.
      // Se suas FKs nos modelos Sequelize já tiverem onDelete: 'CASCADE',
      // o destroy do Usuario pode propagar automaticamente.
      // Caso contrário, é mais seguro deletar na ordem inversa de criação.

      // 1. Deletar Credencial (Se existir)
      await models.CredencialUsuario.destroy({ where: { id_usuario: user.id_usuario }, transaction: t });

      // 2. Deletar Perfis específicos (Cliente, Profissional, Proprietario)
      const pessoa = await models.Pessoa.findOne({ where: { id_usuario: user.id_usuario }, transaction: t });
      if (pessoa) {
        await models.Cliente.destroy({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
        await models.Profissional.destroy({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
        await models.Proprietario.destroy({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
        // 3. Deletar Pessoa
        await models.Pessoa.destroy({ where: { id_pessoa: pessoa.id_pessoa }, transaction: t });
      }

      // 4. Deletar o próprio Usuário
      await user.destroy({ transaction: t });

      return { message: 'Usuário deletado com sucesso.' };
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário.', error: error.message });
  }
};


module.exports = usuarioController;