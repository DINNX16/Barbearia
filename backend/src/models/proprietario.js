// src/models/proprietario.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Proprietario = sequelize.define('Proprietario', {
    id_proprietario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_proprietario'
    },
    id_pessoa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Um proprietário é UMA pessoa específica
      field: 'id_pessoa'
    },
    cnpj: {
      type: DataTypes.STRING(18),
      field: 'cnpj',
      validate: {
        is: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}\-?\d{2}$/ // Corresponde à CONSTRAINT chk_cnpj_valido no DB
      }
    }
  }, {
    tableName: 'proprietario', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Proprietario.associate = (models) => {
    // Um Proprietário PERTENCE A UMA Pessoa (1:1 herança)
    // A FK (id_pessoa) está nesta tabela (proprietario)
    Proprietario.belongsTo(models.Pessoa, {
      foreignKey: 'id_pessoa',
      as: 'pessoa'
    });

    // Um Proprietário TEM MUITAS Barbearias (1:N)
    // A FK (id_proprietario) está na tabela barbearia
    Proprietario.hasMany(models.Barbearia, {
      foreignKey: 'id_proprietario',
      as: 'barbearias'
    });
  };

  return Proprietario;
};