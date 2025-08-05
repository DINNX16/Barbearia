// src/controllers/agendamentoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const agendamentoController = {};

// =============================================================
// FUNÇÃO PARA CRIAR UM AGENDAMENTO (ESTAVA EM FALTA)
// =============================================================
agendamentoController.createAgendamento = async (req, res) => {
    try {
        const { id_profissional, data_hora_inicio } = req.body;
        const userId = req.user.id_usuario; // ID do usuário logado (vem do token)

        // 1. Validação dos dados recebidos
        if (!id_profissional || !data_hora_inicio) {
            return res.status(400).json({ message: 'Profissional e data/hora são obrigatórios.' });
        }

        // 2. Encontrar o ID do cliente correspondente ao ID do usuário
        const pessoa = await prisma.pessoa.findUnique({ where: { id_usuario: userId } });
        if (!pessoa) {
            return res.status(404).json({ message: 'Perfil de pessoa não encontrado para este usuário.' });
        }

        const cliente = await prisma.cliente.findFirst({ where: { id_pessoa: pessoa.id_pessoa } });
        if (!cliente) {
            return res.status(404).json({ message: 'Perfil de cliente não encontrado para este usuário.' });
        }

        // 3. Criar o novo agendamento no banco de dados
        const novoAgendamento = await prisma.agendamento.create({
            data: {
                id_cliente: cliente.id_cliente,
                id_profissional: parseInt(id_profissional),
                data_hora_inicio: new Date(data_hora_inicio), // Converte a string de data para o formato do banco
                status: 'agendado', // Define o status inicial
            }
        });

        res.status(201).json({ message: 'Agendamento criado com sucesso!', agendamento: novoAgendamento });

    } catch (error) {
        console.error("Erro ao criar agendamento:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao criar agendamento.', error: error.message });
    }
};


// Função para buscar todos os agendamentos do usuário logado
agendamentoController.getMeusAgendamentos = async (req, res) => {
    try {
        // O ID do usuário vem do token que o middleware verifyToken já validou
        const userId = req.user.id_usuario;

        // CORREÇÃO: Precisamos encontrar o id_cliente primeiro
        const pessoa = await prisma.pessoa.findUnique({ where: { id_usuario: userId } });
        if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });

        const cliente = await prisma.cliente.findFirst({ where: { id_pessoa: pessoa.id_pessoa } });
        if (!cliente) return res.status(404).json({ message: 'Perfil de cliente não encontrado.' });

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                id_cliente: cliente.id_cliente, // Usa o id_cliente correto
            },
            include: {
                agendamento_servico: {
                    include: {
                        servico: {
                            select: {
                                nome: true,
                                preco_original: true,
                            },
                        },
                    },
                },
                profissional: {
                    include: {
                        pessoa: {
                            select: {
                                nome_completo: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                data_hora_inicio: 'desc',
            },
        });

        const agendamentosFormatados = agendamentos.map(ag => {
            const nomesServicos = ag.agendamento_servico.map(s => s.servico.nome).join(', ');
            const precoTotal = ag.agendamento_servico.reduce((total, item) => {
                return total + Number(item.servico.preco_original || 0);
            }, 0);

            return {
                id: ag.id_agendamento,
                servico: nomesServicos,
                data: ag.data_hora_inicio,
                preco: precoTotal,
                status: ag.status,
                profissional: ag.profissional.pessoa.nome_completo
            }
        });

        res.status(200).json(agendamentosFormatados);

    } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        res.status(500).json({ message: 'Erro ao buscar histórico de agendamentos.', error: error.message });
    }
};

module.exports = agendamentoController;