// src/models/promocaoProduto.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromocaoProduto = sequelize.define('PromocaoProduto', {
    id_promocao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_promocao'
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produto'
    },
    porcentagem_desconto: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: 'porcentagem_desconto',
      validate: {
        min: 0.01, // Corresponde à CONSTRAINT promocao_produto_porcentagem_desconto_check no DB
        max: 100 // Corresponde à CONSTRAINT promocao_produto_porcentagem_desconto_check no DB
      }
    },
    data_inicio: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      allowNull: false,
      field: 'data_inicio'
    },
    data_fim: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      allowNull: false,
      field: 'data_fim',
      validate: {
        isAfterOrEqualStart(value) { // Custom validation para promocao_produto_check
          if (this.data_inicio && value < this.data_inicio) {
            throw new Error('A data_fim deve ser igual ou posterior à data_inicio.');
          }
        }
      }
    },
    ativa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'ativa'
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_criacao'
    }
  }, {
    tableName: 'promocao_produto', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  PromocaoProduto.associate = (models) => {
    // Uma PromocaoProduto PERTENCE A UM Produto (1:N)
    // A FK (id_produto) está nesta tabela (promocao_produto)
    PromocaoProduto.belongsTo(models.Produto, {
      foreignKey: 'id_produto',
      as: 'produto'
    });
  };

  return PromocaoProduto;
};