// src/models/feedback.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Feedback = sequelize.define('Feedback', {
    id_feedback: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_feedback'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_cliente'
    },
    nota: {
      type: DataTypes.INTEGER,
      field: 'nota',
      validate: {
        min: 1, // Corresponde à CONSTRAINT feedback_nota_check no DB
        max: 5  // Corresponde à CONSTRAINT feedback_nota_check no DB
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      field: 'comentario'
    },
    data: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'data'
    },
    editado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      field: 'editado'
    }
  }, {
    tableName: 'feedback', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Feedback.associate = (models) => {
    // Um Feedback PERTENCE A UM Cliente (1:N)
    // A FK (id_cliente) está nesta tabela (feedback)
    Feedback.belongsTo(models.Cliente, {
      foreignKey: 'id_cliente',
      as: 'cliente'
    });
  };

  return Feedback;
};