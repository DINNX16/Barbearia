// src/models/pacoteServicoItem.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PacoteServicoItem = sequelize.define('PacoteServicoItem', {
    id_pacote_servico_item: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_pacote_servico_item'
    },
    id_servico_pacote: { // FK para o serviço que é o pacote
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_servico_pacote'
    },
    id_servico_item: { // FK para o serviço que é um item dentro do pacote
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_servico_item'
    }
  }, {
    tableName: 'pacote_servico_item', // Nome exato da tabela no seu banco de dados
    timestamps: false, // Baseado no seu DB Schema
    indexes: [
      {
        unique: true,
        fields: ['id_servico_pacote', 'id_servico_item'],
        name: 'pacote_servico_item_id_servico_pacote_id_servico_item_key' // Nome da CONSTRAINT UNIQUE no DB
      }
    ]
  });

  PacoteServicoItem.associate = (models) => {
    // Um PacoteServicoItem PERTENCE A UM SERVIÇO (que é o pacote)
    // A FK (id_servico_pacote) está nesta tabela (pacote_servico_item)
    PacoteServicoItem.belongsTo(models.Servico, {
      foreignKey: 'id_servico_pacote',
      as: 'servicoPacote'
    });

    // Um PacoteServicoItem PERTENCE A UM SERVIÇO (que é o item do pacote)
    // A FK (id_servico_item) está nesta tabela (pacote_servico_item)
    PacoteServicoItem.belongsTo(models.Servico, {
      foreignKey: 'id_servico_item',
      as: 'servicoItem'
    });
  };

  return PacoteServicoItem;
};