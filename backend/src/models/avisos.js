// src/models/avisos.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Aviso = sequelize.define('Aviso', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id' // Mapeia para o nome da coluna no DB
    },
    titulo: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'titulo'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'descricao'
    },
    data_publicacao: {
      type: DataTypes.DATE, // Corresponde a timestamp with time zone no DB
      defaultValue: DataTypes.NOW, // Corresponde a CURRENT_TIMESTAMP no DB
      field: 'data_publicacao'
    },
    data_expiracao: {
      type: DataTypes.DATE, // Corresponde a timestamp with time zone no DB
      field: 'data_expiracao'
    },
    tag: {
      type: DataTypes.STRING(50),
      field: 'tag'
    },
    tipo_aviso: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'tipo_aviso'
    },
    caminho_icone: {
      type: DataTypes.STRING(255),
      field: 'caminho_icone'
    },
    link_redirecionamento: {
      type: DataTypes.STRING(512),
      field: 'link_redirecionamento'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'ativo'
    }
  }, {
    tableName: 'avisos', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Aviso.associate = (models) => {
    // A tabela 'avisos' não possui chaves estrangeiras para outras tabelas,
    // então não há associações 'belongsTo' diretas aqui.
    // Ela pode ser referenciada por outras tabelas, mas não é o caso no seu esquema atual.
  };

  return Aviso;
};