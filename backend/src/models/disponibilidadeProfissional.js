// src/models/disponibilidadeProfissional.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DisponibilidadeProfissional = sequelize.define('DisponibilidadeProfissional', {
    id_disponibilidade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_disponibilidade'
    },
    id_profissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_profissional'
    },
    dia_semana: {
      type: DataTypes.INTEGER, // No DB: integer. Pode ser 1=Domingo, 2=Segunda, etc.
      allowNull: false,
      field: 'dia_semana'
    },
    hora_inicio: {
      type: DataTypes.TIME, // Corresponde a time without time zone no DB
      allowNull: false,
      field: 'hora_inicio'
    },
    hora_fim: {
      type: DataTypes.TIME, // Corresponde a time without time zone no DB
      allowNull: false,
      field: 'hora_fim'
    }
  }, {
    tableName: 'disponibilidade_profissional', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  DisponibilidadeProfissional.associate = (models) => {
    // Uma DisponibilidadeProfissional PERTENCE A UM Profissional (1:N)
    // A FK (id_profissional) está nesta tabela (disponibilidade_profissional)
    DisponibilidadeProfissional.belongsTo(models.Profissional, {
      foreignKey: 'id_profissional',
      as: 'profissional'
    });
  };

  return DisponibilidadeProfissional;
};