// src/models/paletaCores.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaletaCores = sequelize.define('PaletaCores', {
    id_cor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_cor'
    },
    id_barbearia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_barbearia'
    },
    nome_uso: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nome_uso'
    },
    valor_cor: {
      type: DataTypes.STRING(7), // Para códigos HEX, ex: '#FFFFFF'
      allowNull: false,
      field: 'valor_cor'
    }
  }, {
    tableName: 'paleta_cores', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  PaletaCores.associate = (models) => {
    // Uma cor da PaletaCores PERTENCE A UMA Barbearia (1:N)
    // A FK (id_barbearia) está nesta tabela (paleta_cores)
    PaletaCores.belongsTo(models.Barbearia, {
      foreignKey: 'id_barbearia',
      as: 'barbearia'
    });
  };

  return PaletaCores;
};