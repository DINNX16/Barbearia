// src/models/credencialUsuario.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CredencialUsuario = sequelize.define('CredencialUsuario', {
    id_credencial: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_credencial'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Garante que um usuário tem apenas uma credencial
      field: 'id_usuario'
    },
    hash_senha: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'hash_senha'
    },
    tipo_autenticacao: {
      type: DataTypes.STRING(30),
      defaultValue: 'local',
      field: 'tipo_autenticacao'
    },
    data_ultima_alteracao_senha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_ultima_alteracao_senha'
    },
    token_recuperacao: {
      type: DataTypes.TEXT,
      field: 'token_recuperacao'
    },
    validade_token: {
      type: DataTypes.DATE,
      field: 'validade_token'
    }
  }, {
    tableName: 'credencial_usuario', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  CredencialUsuario.associate = (models) => {
    // Uma CredencialUsuario PERTENCE A UM Usuário (1:1)
    // A FK (id_usuario) está nesta tabela (credencial_usuario)
    CredencialUsuario.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });
  };

  return CredencialUsuario;
};