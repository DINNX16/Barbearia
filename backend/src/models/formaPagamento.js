// src/models/formaPagamento.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FormaPagamento = sequelize.define('FormaPagamento', {
    id_forma_pagamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_forma_pagamento'
    },
    tipo_pagamento: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true, // Adicionado unique com base na CONSTRAINT uniq_tipo_pagamento no DB
      field: 'tipo_pagamento'
      // No DB: CONSTRAINT forma_pagamento_tipo_pagamento_check
      // Pode adicionar validate: { isIn: [['credito', 'debito', 'pix', 'dinheiro']] }
    },
    nome_exibicao: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nome_exibicao'
    },
    descricao: {
      type: DataTypes.TEXT,
      field: 'descricao'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'ativo'
    },
    permite_parcelamento: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'permite_parcelamento'
    },
    max_parcelas: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
      field: 'max_parcelas',
      validate: {
        min: 1, // Corresponde à CONSTRAINT forma_pagamento_max_parcelas_check no DB
        max: 12 // Corresponde à CONSTRAINT forma_pagamento_max_parcelas_check no DB
      }
    },
    taxa_base: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.00,
      field: 'taxa_base',
      validate: {
        min: 0 // Corresponde à CONSTRAINT forma_pagamento_taxa_base_check no DB
      }
    },
    ordem_exibicao: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'ordem_exibicao'
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_criacao'
    }
  }, {
    tableName: 'forma_pagamento', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  FormaPagamento.associate = (models) => {
    // Uma FormaPagamento PODE TER MUITOS Pagamentos (1:N)
    // A FK (id_forma_pagamento) está na tabela pagamento
    FormaPagamento.hasMany(models.Pagamento, {
      foreignKey: 'id_forma_pagamento',
      as: 'pagamentos'
    });

    // Uma FormaPagamento PODE TER MUITAS Taxas de Parcelamento (1:N)
    // A FK (id_forma_pagamento) está na tabela taxa_parcelamento
    FormaPagamento.hasMany(models.TaxaParcelamento, {
      foreignKey: 'id_forma_pagamento',
      as: 'taxasParcelamento'
    });
  };

  return FormaPagamento;
};