// src/models/galeriaFotos.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GaleriaFotos = sequelize.define('GaleriaFotos', {
    id_foto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_foto'
    },
    id_barbearia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_barbearia'
    },
    imagem_caminho: {
      type: DataTypes.TEXT,
      field: 'imagem_caminho'
    },
    descricao: {
      type: DataTypes.TEXT,
      field: 'descricao'
    },
    data_upload: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'data_upload'
    }
  }, {
    tableName: 'galeria_fotos', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  GaleriaFotos.associate = (models) => {
    // Uma Foto da Galeria PERTENCE A UMA Barbearia (1:N)
    // A FK (id_barbearia) está nesta tabela (galeria_fotos)
    GaleriaFotos.belongsTo(models.Barbearia, {
      foreignKey: 'id_barbearia',
      as: 'barbearia'
    });

    // Uma Foto da Galeria PODE ESTAR ASSOCIADA A VÁRIAS ENTIDADES (1:N para foto_entidade)
    // Esta é a parte "pai" da relação polimórfica com foto_entidade.
    GaleriaFotos.hasMany(models.FotoEntidade, {
        foreignKey: 'id_foto', // id_foto na foto_entidade
        as: 'associacoesComEntidades'
    });
  };

  return GaleriaFotos;
};