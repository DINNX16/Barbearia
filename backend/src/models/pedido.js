// src/models/pedido.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id_pedido: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_pedido'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_cliente'
    },
    data_hora_pedido: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_hora_pedido'
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'valor_total'
    },
    tipo_entrega: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'tipo_entrega'
      // No DB: CONSTRAINT pedido_tipo_entrega_check CHECK (((tipo_entrega)::text = ANY ((ARRAY['retirada'::character varying, 'delivery'::character varying])::text[])))
      // Pode adicionar validate: { isIn: [['retirada', 'delivery']] }
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'status'
      // No DB: CONSTRAINT pedido_status_check CHECK (((status)::text = ANY ((ARRAY['pendente'::character varying, 'pago'::character varying, 'entregue'::character varying, 'cancelado'::character varying])::text[])))
      // Pode adicionar validate: { isIn: [['pendente', 'pago', 'entregue', 'cancelado']] }
    },
    taxa_de_entrega: {
      type: DataTypes.DECIMAL(10, 2),
      field: 'taxa_de_entrega'
    },
    id_endereco_entrega: {
      type: DataTypes.INTEGER,
      field: 'id_endereco_entrega'
    }
  }, {
    tableName: 'pedido', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Pedido.associate = (models) => {
    // Um Pedido PERTENCE A UM Cliente (1:N)
    // A FK (id_cliente) está nesta tabela (pedido)
    Pedido.belongsTo(models.Cliente, {
      foreignKey: 'id_cliente',
      as: 'cliente'
    });

    // Um Pedido PERTENCE A UM Endereco (de entrega) (1:N)
    // A FK (id_endereco_entrega) está nesta tabela (pedido)
    Pedido.belongsTo(models.ClienteEndereco, { // Assumindo que id_endereco_entrega refere-se a ClienteEndereco
      foreignKey: 'id_endereco_entrega',
      as: 'enderecoEntrega'
    });

    // Um Pedido TEM MUITOS Itens de Pedido (1:N)
    // A FK (id_pedido) está na tabela item_pedido
    Pedido.hasMany(models.ItemPedido, {
      foreignKey: 'id_pedido',
      as: 'itens'
    });

    // Um Pedido TEM MUITOS Pagamentos (1:N)
    // A FK (id_pedido) está na tabela pagamento
    Pedido.hasMany(models.Pagamento, {
      foreignKey: 'id_pedido',
      as: 'pagamentos'
    });
  };

  return Pedido;
};