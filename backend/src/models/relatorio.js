// src/models/relatorio.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Relatorio = sequelize.define('Relatorio', {
    id_relatorio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_relatorio'
    },
    id_barbearia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_barbearia'
    },
    tipo: {
      type: DataTypes.STRING(50), // Corresponde a character varying(50)
      allowNull: false,
      field: 'tipo',
      validate: {
        isIn: [['financeiro', 'agendamento', 'produtos', 'estoque', 'clientes', 'outros']] // Corresponde à CONSTRAINT relatorio_tipo_check no DB
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      field: 'descricao'
    },
    data_inicio: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      allowNull: false,
      field: 'data_inicio'
    },
    data_fim: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      allowNull: false,
      field: 'data_fim'
    },
    data_geracao: {
      type: DataTypes.DATEONLY, // Corresponde a DATE sem hora no DB
      defaultValue: DataTypes.NOW, // Corresponde a CURRENT_DATE no DB
      allowNull: false,
      field: 'data_geracao'
    },
    total_registros: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      field: 'total_registros'
    },
    valor_total: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
      field: 'valor_total'
    },
    caminho_arquivo: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'caminho_arquivo'
    }
  }, {
    tableName: 'relatorio', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Relatorio.associate = (models) => {
    // Um Relatorio PERTENCE A UMA Barbearia (1:N)
    // A FK (id_barbearia) está nesta tabela (relatorio)
    Relatorio.belongsTo(models.Barbearia, {
      foreignKey: 'id_barbearia',
      as: 'barbearia'
    });
  };

  return Relatorio;
};