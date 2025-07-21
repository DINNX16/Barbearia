// src/models/movimentacaoEstoque.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MovimentacaoEstoque = sequelize.define('MovimentacaoEstoque', {
    id_movimentacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_movimentacao'
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produto'
    },
    tipo_movimentacao: {
      type: DataTypes.STRING(10), // Corresponde a character varying(10)
      allowNull: false,
      field: 'tipo_movimentacao',
      validate: {
        isIn: [['ENTRADA', 'SAIDA']] // Corresponde à CONSTRAINT movimentacao_estoque_tipo_movimentacao_check no DB
      }
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quantidade',
      validate: {
        min: 1 // Corresponde à CONSTRAINT movimentacao_estoque_quantidade_check no DB
      }
    },
    data_hora: {
      type: DataTypes.DATE, // Corresponde a timestamp with time zone no DB
      defaultValue: DataTypes.NOW,
      field: 'data_hora'
    },
    motivo: {
      type: DataTypes.TEXT,
      field: 'motivo'
    },
    id_usuario: { // FK para a tabela usuario, indicando quem fez a movimentação
      type: DataTypes.INTEGER,
      field: 'id_usuario'
    }
  }, {
    tableName: 'movimentacao_estoque', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  MovimentacaoEstoque.associate = (models) => {
    // Uma MovimentacaoEstoque PERTENCE A UM Produto (1:N)
    // A FK (id_produto) está nesta tabela (movimentacao_estoque)
    MovimentacaoEstoque.belongsTo(models.Produto, {
      foreignKey: 'id_produto',
      as: 'produto'
    });

    // Uma MovimentacaoEstoque PODE TER UM Usuário (quem fez a movimentação) (1:N)
    // A FK (id_usuario) está nesta tabela (movimentacao_estoque)
    MovimentacaoEstoque.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuarioResponsavel'
    });
  };

  return MovimentacaoEstoque;
};