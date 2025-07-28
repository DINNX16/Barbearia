// src/models/servico.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Servico = sequelize.define('Servico', {
    id_servico: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_servico' // Mapeia para o nome da coluna no DB
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nome'
    },
    descricao: {
      type: DataTypes.TEXT,
      field: 'descricao'
    },
    preco_original: {
      type: DataTypes.DECIMAL(10, 2), // Corresponde a numeric(10,2)
      field: 'preco_original'
    },
    preco_promocional: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'preco_promocional'
    },
    duracao_estimada: {
      type: DataTypes.STRING, // Sequelize não tem um tipo 'interval' direto, mapeamos como string
      // Você pode processar isso no código da aplicação ou armazenar em minutos/segundos em INTEGER
      field: 'duracao_estimada'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'ativo'
    },
    pacote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'pacote'
    }
  }, {
    tableName: 'servico', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Servico.associate = (models) => {
    // Um Serviço PODE ESTAR EM MUITOS AGENDAMENTOS (N:M através de agendamento_servico)
    // A tabela de junção é 'agendamento_servico'
    Servico.belongsToMany(models.Agendamento, {
      through: 'AgendamentoServico', // Nome do modelo da tabela de junção
      foreignKey: 'id_servico',       // FK nesta tabela de junção que aponta para Servico
      otherKey: 'id_agendamento',     // FK nesta tabela de junção que aponta para Agendamento
      as: 'agendamentosAssociados'
    });

    // Um Serviço PODE SER OFERECIDO POR MUITOS PROFISSIONAIS (N:M através de profissional_servico)
    // A tabela de junção é 'profissional_servico'
    Servico.belongsToMany(models.Profissional, {
      through: 'ProfissionalServico', // Nome do modelo da tabela de junção
      foreignKey: 'id_servico',       // FK nesta tabela de junção que aponta para Servico
      otherKey: 'id_profissional',    // FK nesta tabela de junção que aponta para Profissional
      as: 'profissionaisQueOferecem'
    });

    // Um Serviço pode ser um item em um Pacote de Serviços (id_servico_item na pacote_servico_item) (1:N)
    Servico.hasMany(models.PacoteServicoItem, {
      foreignKey: 'id_servico_item',
      as: 'itemDePacote'
    });

    // Um Serviço pode SER um Pacote de Serviços (id_servico_pacote na pacote_servico_item) (1:N)
    Servico.hasMany(models.PacoteServicoItem, {
      foreignKey: 'id_servico_pacote',
      as: 'pacoteComItens'
    });

    // Um Serviço pode ter FOTOS associadas (N:M através de foto_entidade)
    // Nota: FotoEntidade é uma tabela genérica. É um hasMany aqui, mas o relacionamento real é N:M via FotoEntidade e GaleriaFotos.
    Servico.hasMany(models.FotoEntidade, {
        foreignKey: 'id_referencia', // id_referencia na foto_entidade
        constraints: false, // Desabilita a FK enforcement do Sequelize, pois é uma tabela polimórfica
        scope: {
            tipo_entidade: 'servico' // Adiciona um escopo para filtrar por tipo de entidade
        },
        as: 'fotos'
    });

  };

  return Servico;
};