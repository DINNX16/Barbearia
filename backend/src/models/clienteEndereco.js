// src/models/clienteEndereco.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ClienteEndereco = sequelize.define('ClienteEndereco', {
    id_cliente_endereco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_cliente_endereco'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_cliente'
    },
    logradouro: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'logradouro'
    },
    numero: {
      type: DataTypes.STRING(50),
      field: 'numero'
    },
    complemento: {
      type: DataTypes.STRING(255),
      field: 'complemento'
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'bairro'
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'cidade'
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false,
      field: 'estado'
    },
    cep: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'cep'
    },
    referencia: {
      type: DataTypes.TEXT,
      field: 'referencia'
    }
  }, {
    tableName: 'cliente_endereco', // Nome exato da tabela no seu banco de dados
    timestamps: false, // Baseado no seu DB Schema
    // A CONSTRAINT unique cliente_endereco_id_cliente_logradouro_numero_bairro_cidade_key no DB
    // pode ser replicada com indexes se necessário, mas para o Sequelize basta a definição dos campos.
  });

  ClienteEndereco.associate = (models) => {
    // Um ClienteEndereco PERTENCE A UM Cliente (1:N)
    // A FK (id_cliente) está nesta tabela (cliente_endereco)
    ClienteEndereco.belongsTo(models.Cliente, {
      foreignKey: 'id_cliente',
      as: 'cliente'
    });

    // Um ClienteEndereco PODE SER O ENDEREÇO DE ENTREGA DE MUITOS Pedidos (1:N)
    // A FK (id_endereco_entrega) está na tabela pedido
    // Esta associação é definida principalmente no modelo Pedido, aqui é o inverso.
    ClienteEndereco.hasMany(models.Pedido, {
        foreignKey: 'id_endereco_entrega',
        as: 'pedidosQueUsamEsteEndereco'
    });
  };

  return ClienteEndereco;
};