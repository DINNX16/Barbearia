// src/models/cliente.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cliente = sequelize.define('Cliente', {
    id_cliente: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_cliente'
    },
    id_pessoa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Um cliente é UMA pessoa específica
      field: 'id_pessoa'
    },
    nivel_fidelidade: {
      type: DataTypes.STRING(20),
      field: 'nivel_fidelidade',
      validate: {
        isIn: [['bronze', 'prata', 'ouro', 'diamante', null]] // Corresponde à CONSTRAINT chk_nivel_fidelidade no DB
      }
    },
    pontos_fidelizacao: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'pontos_fidelizacao'
    }
  }, {
    tableName: 'cliente', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Cliente.associate = (models) => {
    // Um Cliente PERTENCE A UMA Pessoa (1:1 herança)
    // A FK (id_pessoa) está nesta tabela (cliente)
    Cliente.belongsTo(models.Pessoa, {
      foreignKey: 'id_pessoa',
      as: 'pessoa'
    });

    // Um Cliente TEM MUITOS Agendamentos (1:N)
    // A FK (id_cliente) está na tabela agendamento
    Cliente.hasMany(models.Agendamento, {
      foreignKey: 'id_cliente',
      as: 'agendamentos'
    });

    // Um Cliente TEM MUITOS Pedidos (1:N)
    // A FK (id_cliente) está na tabela pedido
    Cliente.hasMany(models.Pedido, {
      foreignKey: 'id_cliente',
      as: 'pedidos'
    });

    // Um Cliente TEM MUITAS Anamneses (1:N)
    // A FK (id_cliente) está na tabela anamnese
    Cliente.hasMany(models.Anamnese, {
      foreignKey: 'id_cliente',
      as: 'anamneses'
    });

    // Um Cliente TEM MUITOS Feedbacks (1:N)
    // A FK (id_cliente) está na tabela feedback
    Cliente.hasMany(models.Feedback, {
      foreignKey: 'id_cliente',
      as: 'feedbacks'
    });

    // Um Cliente PODE TER MÚLTIPLOS Endereços (1:N para tabela cliente_endereco)
    Cliente.hasMany(models.ClienteEndereco, {
      foreignKey: 'id_cliente',
      as: 'enderecosDeEntrega'
    });
  };

  return Cliente;
};