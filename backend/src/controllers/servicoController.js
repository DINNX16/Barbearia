// src/controllers/servicoController.js
const servicoController = {};

/**
 * @description Cria um novo serviço no sistema.
 * @route POST /api/servicos
 * @access Proprietário
 * @param {object} req.body - Dados do serviço (nome, descricao, preco_original, preco_promocional, duracao_estimada, ativo)
 */
servicoController.createServico = async (req, res) => { // Nome da função ajustado para createServico
  const { nome, descricao, preco_original, preco_promocional, duracao_estimada, ativo } = req.body;
  
  console.log('DEBUG SERVICO: Função createServico foi alcançada.'); // NOVO LOG
  console.log('DEBUG SERVICO: Dados recebidos no body:', req.body); // NOVO LOG

  try {
    const prisma = req.app.get('prisma'); // Acessa a instância do PrismaClient
    console.log('DEBUG SERVICO: Prisma instance in createServico:', !!prisma); // Log ajustado

    // Opcional: Se você quiser associar o serviço ao proprietário que o criou
    // const proprietarioId = req.user.id_usuario; // Acessa o ID do usuário logado do token
    // console.log('DEBUG SERVICO: Proprietário logado ID:', proprietarioId); // NOVO LOG

    const newService = await prisma.servico.create({
      data: {
        nome,
        descricao,
        preco_original,
        preco_promocional,
        duracao_estimada, // Enviado como Int (minutos), Prisma deve lidar com o tipo interval
        ativo,
        // Se o seu schema.prisma tiver um campo 'proprietarioId' no modelo Servico,
        // você precisaria passá-lo aqui:
        // proprietario: { connect: { id_usuario: proprietarioId } } 
      },
    });
    console.log('DEBUG SERVICO: Serviço criado com sucesso no DB.'); // NOVO LOG
    res.status(201).json({ message: 'Serviço criado com sucesso!', service: newService });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao criar serviço', error: error.message });
  }
};

/**
 * @description Obtém todos os serviços disponíveis.
 * @route GET /api/servicos
 * @access Proprietário, Profissional, Cliente
 */
servicoController.getAllServicos = async (req, res) => { // Nome da função ajustado para getAllServicos
  console.log('DEBUG SERVICO: Função getAllServicos foi alcançada.'); // NOVO LOG
  try {
    const prisma = req.app.get('prisma');
    const services = await prisma.servico.findMany();
    res.status(200).json(services);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar serviços', error: error.message });
  }
};

/**
 * @description Obtém um serviço específico por ID.
 * @route GET /api/servicos/:id
 * @access Proprietário, Profissional, Cliente
 * @param {string} req.params.id - ID do serviço
 */
servicoController.getServicoById = async (req, res) => { // Nome da função ajustado para getServicoById
  const { id } = req.params;
  console.log('DEBUG SERVICO: Função getServicoById foi alcançada. ID:', id); // NOVO LOG
  try {
    const prisma = req.app.get('prisma');
    const service = await prisma.servico.findUnique({
      where: { id_servico: parseInt(id) },
    });
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error('Erro ao buscar serviço por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar serviço por ID', error: error.message });
  }
};

/**
 * @description Atualiza um serviço existente por ID.
 * @route PUT /api/servicos/:id
 * @access Proprietário
 * @param {string} req.params.id - ID do serviço
 * @param {object} req.body - Dados atualizados do serviço
 */
servicoController.updateServico = async (req, res) => { // Adicionado updateServico
  const { id } = req.params;
  const { nome, descricao, preco_original, preco_promocional, duracao_estimada, ativo } = req.body;
  console.log('DEBUG SERVICO: Função updateServico foi alcançada. ID:', id); // NOVO LOG

  try {
    const prisma = req.app.get('prisma');
    const updatedService = await prisma.servico.update({
      where: { id_servico: parseInt(id) },
      data: {
        nome,
        descricao,
        preco_original,
        preco_promocional,
        duracao_estimada,
        ativo,
      },
    });
    res.status(200).json({ message: 'Serviço atualizado com sucesso!', service: updatedService });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar serviço', error: error.message });
  }
};

/**
 * @description Deleta um serviço por ID.
 * @route DELETE /api/servicos/:id
 * @access Proprietário
 * @param {string} req.params.id - ID do serviço
 */
servicoController.deleteServico = async (req, res) => { // Adicionado deleteServico
  const { id } = req.params;
  console.log('DEBUG SERVICO: Função deleteServico foi alcançada. ID:', id); // NOVO LOG

  try {
    const prisma = req.app.get('prisma');
    await prisma.servico.delete({
      where: { id_servico: parseInt(id) },
    });
    res.status(200).json({ message: 'Serviço deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao deletar serviço', error: error.message });
  }
};


module.exports = servicoController;
