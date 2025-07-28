// src/models/fotoEntidade.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const FotoEntidade = sequelize.define('FotoEntidade', {
    id_foto_entidade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_foto_entidade'
    },
    id_foto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_foto'
    },
    tipo_entidade: {
      type: DataTypes.STRING(50), // Corresponde a character varying(50)
      allowNull: false,
      field: 'tipo_entidade',
      validate: {
        isIn: [['servico', 'produto', 'profissional', 'barbearia']] // Corresponde à CONSTRAINT foto_entidade_tipo_entidade_check no DB
      }
    },
    id_referencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_referencia' // Este campo guarda o ID da entidade relacionada (servico_id, produto_id, etc.)
    }
  }, {
    tableName: 'foto_entidade', // Nome exato da tabela no seu banco de dados
    timestamps: false, // Baseado no seu DB Schema
    indexes: [
      {
        unique: true,
        fields: ['id_foto', 'tipo_entidade', 'id_referencia'],
        name: 'uq_foto_entidade' // Nome da CONSTRAINT UNIQUE no DB
      }
    ]
  });

  FotoEntidade.associate = (models) => {
    // Uma FotoEntidade PERTENCE A UMA Foto na Galeria (1:N)
    // A FK (id_foto) está nesta tabela (foto_entidade)
    FotoEntidade.belongsTo(models.GaleriaFotos, {
      foreignKey: 'id_foto',
      as: 'fotoGaleria'
    });

    // Associações polimórficas (BelongsTo, mas com condição)
    // Uma FotoEntidade pode pertencer a um Serviço, Produto, Profissional ou Barbearia.
    // Essas associações são definidas sem foreignKey e com `constraints: false`
    // porque `id_referencia` pode apontar para diferentes tabelas.
    // O Sequelize não enforce a FK aqui, mas você pode usá-las para `include` condicional.

    // FotoEntidade BelongsTo Servico (quando tipo_entidade = 'servico')
    FotoEntidade.belongsTo(models.Servico, {
      foreignKey: 'id_referencia',
      constraints: false, // Chave estrangeira não imposta no DB (polimorfismo)
      scope: {
        tipo_entidade: 'servico'
      },
      as: 'servicoAssociado'
    });

    // FotoEntidade BelongsTo Produto (quando tipo_entidade = 'produto')
    FotoEntidade.belongsTo(models.Produto, {
      foreignKey: 'id_referencia',
      constraints: false,
      scope: {
        tipo_entidade: 'produto'
      },
      as: 'produtoAssociado'
    });

    // FotoEntidade BelongsTo Profissional (quando tipo_entidade = 'profissional')
    FotoEntidade.belongsTo(models.Profissional, {
      foreignKey: 'id_referencia',
      constraints: false,
      scope: {
        tipo_entidade: 'profissional'
      },
      as: 'profissionalAssociado'
    });

    // FotoEntidade BelongsTo Barbearia (quando tipo_entidade = 'barbearia')
    FotoEntidade.belongsTo(models.Barbearia, {
      foreignKey: 'id_referencia',
      constraints: false,
      scope: {
        tipo_entidade: 'barbearia'
      },
      as: 'barbeariaAssociada'
    });
  };

  return FotoEntidade;
};