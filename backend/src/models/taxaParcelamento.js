// src/models/taxaParcelamento.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TaxaParcelamento = sequelize.define('TaxaParcelamento', {
    id_taxa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_taxa'
    },
    id_forma_pagamento: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_forma_pagamento'
    },
    numero_parcelas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'numero_parcelas',
      validate: {
        min: 1, // Corresponde à CONSTRAINT taxa_parcelamento_numero_parcelas_check no DB
        max: 12 // Corresponde à CONSTRAINT taxa_parcelamento_numero_parcelas_check no DB
      }
    },
    taxa_juros: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'taxa_juros',
      validate: {
        min: 0 // Corresponde à CONSTRAINT taxa_parcelamento_taxa_juros_check no DB
      }
    },
    data_validade: {
      type: DataTypes.DATEONLY, // Usar DATEONLY para tipo DATE sem hora
      defaultValue: DataTypes.NOW, // Corresponde a CURRENT_DATE
      allowNull: false,
      field: 'data_validade'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'ativo'
    }
  }, {
    tableName: 'taxa_parcelamento', // Nome exato da tabela no seu banco de dados
    timestamps: false, // Baseado no seu DB Schema
    indexes: [
      {
        unique: true,
        fields: ['id_forma_pagamento', 'numero_parcelas'],
        name: 'uniq_combinacao' // Nome da CONSTRAINT UNIQUE no DB
      }
    ]
  });

  TaxaParcelamento.associate = (models) => {
    // Uma TaxaParcelamento PERTENCE A UMA FormaPagamento (1:N)
    // A FK (id_forma_pagamento) está nesta tabela (taxa_parcelamento)
    TaxaParcelamento.belongsTo(models.FormaPagamento, {
      foreignKey: 'id_forma_pagamento',
      as: 'formaPagamento'
    });
  };

  return TaxaParcelamento;
};