// src/models/anamnese.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Anamnese = sequelize.define('Anamnese', {
    id_anamnese: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_anamnese'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_cliente'
    },
    alergias: {
      type: DataTypes.STRING(80),
      field: 'alergias'
    },
    historico_reacoes: {
      type: DataTypes.STRING(80),
      field: 'historico_reacoes'
    },
    data_consentimento: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      defaultValue: DataTypes.NOW, // Corresponde a CURRENT_DATE no DB
      allowNull: false,
      field: 'data_consentimento'
    }
  }, {
    tableName: 'anamnese', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Anamnese.associate = (models) => {
    // Uma Anamnese PERTENCE A UM Cliente (1:N)
    // A FK (id_cliente) está nesta tabela (anamnese)
    Anamnese.belongsTo(models.Cliente, {
      foreignKey: 'id_cliente',
      as: 'cliente'
    });
  };

  return Anamnese;
};