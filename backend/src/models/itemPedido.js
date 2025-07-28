// src/models/itemPedido.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ItemPedido = sequelize.define('ItemPedido', {
    id_item_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_item_pedido'
    },
    id_pedido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_pedido'
    },
    id_produto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_produto'
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quantidade',
      validate: {
        min: 1 // Corresponde à CONSTRAINT item_pedido_quantidade_check no DB
      }
    },
    preco_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'preco_unitario'
    },
    desconto: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: 'desconto',
      validate: {
        min: 0 // Corresponde à CONSTRAINT item_pedido_desconto_check no DB
      }
    }
  }, {
    tableName: 'item_pedido', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  ItemPedido.associate = (models) => {
    // Um ItemPedido PERTENCE A UM Pedido (1:N)
    // A FK (id_pedido) está nesta tabela (item_pedido)
    ItemPedido.belongsTo(models.Pedido, {
      foreignKey: 'id_pedido',
      as: 'pedido'
    });

    // Um ItemPedido PERTENCE A UM Produto (1:N)
    // A FK (id_produto) está nesta tabela (item_pedido)
    ItemPedido.belongsTo(models.Produto, {
      foreignKey: 'id_produto',
      as: 'produto'
    });
  };

  return ItemPedido;
};