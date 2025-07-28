// src/controllers/servicoController.js
const servicoController = {};

// Função para obter todos os serviços
servicoController.getAllServicos = async (req, res) => {
  try {
    const prisma = req.app.get('prisma'); // Acessa a instância do PrismaClient
    const servicos = await prisma.servico.findMany({
      // Você pode incluir relações aqui se necessário, como fotos ou pacotes
      // include: {
      //   foto_entidade: true, // Se quiser incluir fotos associadas ao serviço
      //   pacote_servico_item_pacote_servico_item_id_servico_itemToservico: true, // Itens de pacote
      //   pacote_servico_item_pacote_servico_item_id_servico_pacoteToservico: true, // Se o serviço for um pacote
      // }
    });
    res.status(200).json(servicos);
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Função para obter um serviço por ID
servicoController.getServicoById = async (req, res) => {
  try {
    const prisma = req.app.get('prisma');
    const { id } = req.params;
    const servico = await prisma.servico.findUnique({
      where: { id_servico: parseInt(id) }, // Converte o ID para inteiro
      // include: {
      //   foto_entidade: true,
      //   pacote_servico_item_pacote_servico_item_id_servico_itemToservico: true,
      //   pacote_servico_item_pacote_servico_item_id_servico_pacoteToservico: true,
      // }
    });

    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado.' });
    }

    res.status(200).json(servico);
  } catch (error) {
    console.error('Erro ao buscar serviço por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
};

// Função para criar um novo serviço
servicoController.createServico = async (req, res) => {
  const {
    nome,
    descricao,
    preco_original,
    preco_promocional,
    duracao_estimada, // Lembre-se que é Unsupported("interval") no Prisma
    ativo,
    pacote
  } = req.body;

  try {
    const prisma = req.app.get('prisma');
    const newServico = await prisma.servico.create({
      data: {
        nome,
        descricao,
        preco_original: parseFloat(preco_original), // Converte para float/decimal
        preco_promocional: preco_promocional ? parseFloat(preco_promocional) : null,
        duracao_estimada, // String, como mapeado no Prisma
        ativo,
        pacote
      }
    });
    res.status(201).json({ message: 'Serviço criado com sucesso!', servico: newServico });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({
      message: 'Erro ao criar serviço.',
      error: error.message,
      details: error.meta ? error.meta.cause : undefined
    });
  }
};

// Função para atualizar um serviço
servicoController.updateServico = async (req, res) => {
  const { id } = req.params;
  const {
    nome,
    descricao,
    preco_original,
    preco_promocional,
    duracao_estimada,
    ativo,
    pacote
  } = req.body;

  try {
    const prisma = req.app.get('prisma');
    const updatedServico = await prisma.servico.update({
      where: { id_servico: parseInt(id) },
      data: {
        nome,
        descricao,
        preco_original: parseFloat(preco_original),
        preco_promocional: preco_promocional ? parseFloat(preco_promocional) : null,
        duracao_estimada,
        ativo,
        pacote
      }
    });
    res.status(200).json({ message: 'Serviço atualizado com sucesso!', servico: updatedServico });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ message: 'Erro ao atualizar serviço.', error: error.message, details: error.meta ? error.meta.cause : undefined });
  }
};

// Função para deletar um serviço
servicoController.deleteServico = async (req, res) => {
  const { id } = req.params;
  try {
    const prisma = req.app.get('prisma');
    await prisma.servico.delete({
      where: { id_servico: parseInt(id) }
    });
    res.status(200).json({ message: 'Serviço deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar serviço:', error);
    res.status(500).json({ message: 'Erro ao deletar serviço.', error: error.message, details: error.meta ? error.meta.cause : undefined });
  }
};

module.exports = servicoController;
