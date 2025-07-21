// src/models/excecaoDisponibilidade.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ExcecaoDisponibilidade = sequelize.define('ExcecaoDisponibilidade', {
    id_excecao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_excecao'
    },
    id_profissional: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_profissional'
    },
    data_inicio: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      allowNull: false,
      field: 'data_inicio'
    },
    data_fim: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      allowNull: false,
      field: 'data_fim',
      validate: {
        isAfterOrEqualStart(value) { // Custom validation para chk_excecao_periodo_valido
          if (this.data_inicio && value < this.data_inicio) {
            throw new Error('A data_fim deve ser igual ou posterior à data_inicio.');
          }
        }
      }
    },
    motivo: {
      type: DataTypes.STRING(255),
      field: 'motivo'
    },
    hora_inicio: {
      type: DataTypes.TIME, // Corresponde a time without time zone no DB
      field: 'hora_inicio'
    },
    hora_fim: {
      type: DataTypes.TIME, // Corresponde a time without time zone no DB
      field: 'hora_fim'
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: 'criado_em'
    }
  }, {
    tableName: 'excecoes_disponibilidade', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  ExcecaoDisponibilidade.associate = (models) => {
    // Uma ExcecaoDisponibilidade PERTENCE A UM Profissional (1:N)
    // A FK (id_profissional) está nesta tabela (excecoes_disponibilidade)
    ExcecaoDisponibilidade.belongsTo(models.Profissional, {
      foreignKey: 'id_profissional',
      as: 'profissional'
    });
  };

  return ExcecaoDisponibilidade;
};