// src/controllers/agendamentoController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const agendamentoController = {};

// Função para buscar todos os agendamentos do usuário logado
agendamentoController.getMeusAgendamentos = async (req, res) => {
    try {
        // O ID do usuário vem do token que o middleware verifyToken já validou
        const userId = req.user.id_usuario;

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                id_cliente: userId,
            },
            include: {
                // Incluímos os serviços para saber o que foi agendado
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
                // Incluímos o profissional para saber com quem foi
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
                data_hora_inicio: 'desc', // Ordena dos mais recentes para os mais antigos
            },
        });

        // Formatamos os dados para facilitar o uso no frontend
        const agendamentosFormatados = agendamentos.map(ag => {
            // Pega o nome de todos os serviços e junta numa string
            const nomesServicos = ag.agendamento_servico.map(s => s.servico.nome).join(', ');
            // Calcula o preço total do agendamento
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