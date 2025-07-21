// src/models/pagamento.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pagamento = sequelize.define('Pagamento', {
    id_pagamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_pagamento'
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_pedido'
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'valor'
    },
    data_hora_pagamento: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'data_hora_pagamento'
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'status'
      // No DB: CONSTRAINT pagamento_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'aprovado'::character varying, 'recusado'::character varying, 'cancelado'::character varying])::text[])))
      // Pode adicionar validate: { isIn: [['pendente', 'aprovado', 'recusado', 'cancelado']] }
    },
    id_forma_pagamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_forma_pagamento'
    },
    observacoes: {
      type: DataTypes.TEXT,
      field: 'observacoes'
    }
  }, {
    tableName: 'pagamento', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Pagamento.associate = (models) => {
    // Um Pagamento PERTENCE A UM Pedido (1:N)
    // A FK (id_pedido) está nesta tabela (pagamento)
    Pagamento.belongsTo(models.Pedido, {
      foreignKey: 'id_pedido',
      as: 'pedido'
    });

    // Um Pagamento PERTENCE A UMA FormaDePagamento (1:N)
    // A FK (id_forma_pagamento) está nesta tabela (pagamento)
    Pagamento.belongsTo(models.FormaPagamento, {
      foreignKey: 'id_forma_pagamento',
      as: 'formaPagamento'
    });
  };

  return Pagamento;
};