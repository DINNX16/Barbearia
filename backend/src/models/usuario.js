const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_usuario' // Mapeia para o nome da coluna no DB
    },
    email: {
      type: DataTypes.STRING(100), // Corresponde a CHARACTER VARYING(100)
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      },
      field: 'email'
    },
    tipo_usuario: {
      type: DataTypes.STRING(50),
      field: 'tipo_usuario'
    },
    data_criacao: {
      type: DataTypes.DATE, // Corresponde a TIMESTAMP WITHOUT TIME ZONE
      defaultValue: DataTypes.NOW, // Usa CURRENT_TIMESTAMP do DB
      field: 'data_criacao'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'ativo'
    },
    ultimo_login: {
      type: DataTypes.DATE,
      field: 'ultimo_login'
    }
  }, {
    tableName: 'usuario', // Nome exato da tabela no seu banco de dados
  });

  // Defina associações aqui se houver alguma (ex: com CredencialUsuario)
  // Exemplo:
  // Usuario.associate = (models) => {
  //   Usuario.hasOne(models.CredencialUsuario, { foreignKey: 'id_usuario' });
  // };

  return Usuario;
};