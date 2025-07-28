// src/models/endereco.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Endereco = sequelize.define('Endereco', {
    id_endereco: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_endereco'
    },
    cep: {
      type: DataTypes.STRING(9),
      allowNull: false,
      field: 'cep',
      validate: {
        is: /^\d{5}-?\d{3}$/ // Validação regex para CEP, corresponde à CONSTRAINT chk_cep_format no DB
      }
    },
    logradouro: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'logradouro'
    },
    numero: {
      type: DataTypes.STRING(10),
      field: 'numero'
    },
    complemento: {
      type: DataTypes.STRING(50),
      field: 'complemento'
    },
    bairro: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'bairro'
    },
    cidade: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'cidade'
    },
    estado: {
      type: DataTypes.STRING(45), // Seu DB usa 45, mas geralmente é 2 (UF) para consistência
      allowNull: false,
      field: 'estado'
    },
    pais: {
      type: DataTypes.STRING(45),
      defaultValue: 'Brasil',
      allowNull: false,
      field: 'pais'
    },
    data_criacao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Corresponde a CURRENT_TIMESTAMP no DB
      field: 'data_criacao'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'ativo'
    }
  }, {
    tableName: 'endereco', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Endereco.associate = (models) => {
    // Um Endereço pode ser o endereço de residência de VÁRIAS Pessoas (1:N)
    // A FK (id_endereco) está na tabela pessoa
    Endereco.hasMany(models.Pessoa, {
      foreignKey: 'id_endereco',
      as: 'pessoasResidindo'
    });

    // Um Endereço pode ser o endereço de UMA Barbearia (1:1)
    // A FK (id_endereco) está na tabela barbearia
    Endereco.hasOne(models.Barbearia, {
      foreignKey: 'id_endereco',
      as: 'barbeariaLocalizada'
    });

    // Um Endereço pode ser o endereço de entrega de VÁRIOS Pedidos (1:N)
    // A FK (id_endereco_entrega) está na tabela pedido
    Endereco.hasMany(models.Pedido, {
      foreignKey: 'id_endereco_entrega',
      as: 'pedidosEntregues'
    });

    // Um Endereço pode estar em vários ClienteEndereco (tabela de junção, mas aqui é 1:N)
    // A FK (id_endereco) está na tabela cliente_endereco
    // Nota: A tabela cliente_endereco tem campos de endereço direto, e não uma FK para a tabela endereco geral.
    // Assim, esta associação como `hasMany` direto para `cliente_endereco` não se aplica ao seu schema.
    // O modelo ClienteEndereco já contém os campos de endereço direto.
    // Removendo a associação que não se encaixa no seu schema ClienteEndereco.
  };

  return Endereco;
};