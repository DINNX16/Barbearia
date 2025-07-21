// src/models/agendamento.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agendamento = sequelize.define('Agendamento', {
    id_agendamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_agendamento'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_cliente'
    },
    id_profissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_profissional'
    },
    data_hora_inicio: {
      type: DataTypes.DATE, // Corresponde a timestamp without time zone
      field: 'data_hora_inicio'
    },
    data_hora_fim: {
      type: DataTypes.DATE, // Corresponde a timestamp without time zone
      field: 'data_hora_fim'
    },
    status: {
      type: DataTypes.STRING(50), // Corresponde a character varying(50) e ao ENUM status_agendamento
      allowNull: false,
      field: 'status'
      // No DB, tem um CONSTRAINT agendamento_status_check
      // Você pode replicar com validate: { isIn: [['confirmado', 'cancelado', 'concluido']] }
    },
    observacao: {
      type: DataTypes.TEXT,
      field: 'observacao'
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_criacao'
    },
    // O campo 'periodo' é GENERATED ALWAYS AS tsrange no DB e não precisa ser mapeado no Sequelize
    // A constraint 'agendamento_sem_conflito' é uma regra de negócio do DB
  }, {
    tableName: 'agendamento', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Agendamento.associate = (models) => {
    // Um Agendamento PERTENCE A UM Cliente (1:N)
    // A FK (id_cliente) está nesta tabela (agendamento)
    Agendamento.belongsTo(models.Cliente, {
      foreignKey: 'id_cliente',
      as: 'cliente'
    });

    // Um Agendamento PERTENCE A UM Profissional (1:N)
    // A FK (id_profissional) está nesta tabela (agendamento)
    Agendamento.belongsTo(models.Profissional, {
      foreignKey: 'id_profissional',
      as: 'profissional'
    });

    // Um Agendamento PODE INCLUIR MUITOS SERVIÇOS (N:M através de agendamento_servico)
    // A tabela de junção é 'agendamento_servico'
    Agendamento.belongsToMany(models.Servico, {
      through: 'AgendamentoServico', // Nome do modelo da tabela de junção
      foreignKey: 'id_agendamento',  // FK nesta tabela de junção que aponta para Agendamento
      otherKey: 'id_servico',        // FK nesta tabela de junção que aponta para Servico
      as: 'servicosAgendados'
    });
  };

  return Agendamento;
};