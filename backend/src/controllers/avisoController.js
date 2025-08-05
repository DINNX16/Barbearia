// src/controllers/avisoController.js
const avisoController = {};

/**
 * @description Cria um novo aviso no sistema.
 * @route POST /api/avisos
 * @access Proprietário
 * @param {object} req.body - Dados do aviso (titulo, descricao, tag, tipo_aviso, link_redirecionamento, ativo)
 */
avisoController.createAviso = async (req, res) => {
    const { titulo, descricao, tag, tipo_aviso, link_redirecionamento, ativo } = req.body;

    try {
        const prisma = req.app.get('prisma');
        const newAviso = await prisma.avisos.create({
            data: {
                titulo,
                descricao,
                tag,
                tipo_aviso,
                link_redirecionamento,
                ativo,
            },
        });
        res.status(201).json({ message: 'Aviso criado com sucesso!', aviso: newAviso });
    } catch (error) {
        console.error('Erro ao criar aviso:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar aviso', error: error.message });
    }
};

/**
 * @description Obtém todos os avisos disponíveis.
 * @route GET /api/avisos
 * @access Proprietário, Profissional, Cliente
 */
avisoController.getAllAvisos = async (req, res) => {
    try {
        const prisma = req.app.get('prisma');
        const avisos = await prisma.avisos.findMany();
        res.status(200).json(avisos);
    } catch (error) {
        console.error('Erro ao buscar avisos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar avisos', error: error.message });
    }
};

/**
 * @description Obtém um aviso específico por ID.
 * @route GET /api/avisos/:id
 * @access Proprietário, Profissional, Cliente
 * @param {string} req.params.id - ID do aviso
 */
avisoController.getAvisoById = async (req, res) => {
    const { id } = req.params;
    try {
        const prisma = req.app.get('prisma');
        const aviso = await prisma.avisos.findUnique({
            where: { id: parseInt(id) },
        });
        if (!aviso) {
            return res.status(404).json({ message: 'Aviso não encontrado.' });
        }
        res.status(200).json(aviso);
    } catch (error) {
        console.error('Erro ao buscar aviso por ID:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar aviso por ID', error: error.message });
    }
};

/**
 * @description Atualiza um aviso existente por ID.
 * @route PUT /api/avisos/:id
 * @access Proprietário
 * @param {string} req.params.id - ID do aviso
 * @param {object} req.body - Dados atualizados do aviso
 */
avisoController.updateAviso = async (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, tag, tipo_aviso, link_redirecionamento, ativo } = req.body;
    
    try {
        const prisma = req.app.get('prisma');
        const updatedAviso = await prisma.avisos.update({
            where: { id: parseInt(id) },
            data: {
                titulo,
                descricao,
                tag,
                tipo_aviso,
                link_redirecionamento,
                ativo,
            },
        });
        res.status(200).json({ message: 'Aviso atualizado com sucesso!', aviso: updatedAviso });
    } catch (error) {
        console.error('Erro ao atualizar aviso:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao atualizar aviso', error: error.message });
    }
};

/**
 * @description Deleta um aviso por ID.
 * @route DELETE /api/avisos/:id
 * @access Proprietário
 * @param {string} req.params.id - ID do aviso
 */
avisoController.deleteAviso = async (req, res) => {
    const { id } = req.params;
    
    try {
        const prisma = req.app.get('prisma');
        await prisma.avisos.delete({
            where: { id: parseInt(id) },
        });
        res.status(200).json({ message: 'Aviso deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar aviso:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao deletar aviso', error: error.message });
    }
};

module.exports = avisoController;
