// src/models/barbearia.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Barbearia = sequelize.define('Barbearia', {
    id_barbearia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_barbearia'
    },
    id_proprietario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'id_proprietario'
    },
    nome_fantasia: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: 'nome_fantasia'
    },
    logo: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'logo'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'descricao'
    },
    telefone: {
      type: DataTypes.STRING(15),
      field: 'telefone'
    },
    horario_funcionamento: {
      type: DataTypes.TEXT,
      field: 'horario_funcionamento'
    },
    redes_sociais: {
      type: DataTypes.JSONB, // Corresponde ao tipo JSONB no PostgreSQL
      field: 'redes_sociais'
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      field: 'latitude'
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      field: 'longitude'
    },
    id_endereco: {
      type: DataTypes.INTEGER,
      field: 'id_endereco'
    },
    dias_aviso_validade_produto: {
      type: DataTypes.INTEGER,
      defaultValue: 90,
      allowNull: false,
      field: 'dias_aviso_validade_produto'
    }
  }, {
    tableName: 'barbearia', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Barbearia.associate = (models) => {
    // Uma Barbearia PERTENCE A UM Proprietário (1:N)
    // A FK (id_proprietario) está nesta tabela (barbearia)
    Barbearia.belongsTo(models.Proprietario, {
      foreignKey: 'id_proprietario',
      as: 'proprietario'
    });

    // Uma Barbearia PERTENCE A UM Endereço (1:1 ou 1:N)
    // A FK (id_endereco) está nesta tabela (barbearia)
    Barbearia.belongsTo(models.Endereco, {
      foreignKey: 'id_endereco',
      as: 'endereco'
    });

    // Uma Barbearia TEM MUITAS GaleriaFotos (1:N)
    // A FK (id_barbearia) está na tabela galeria_fotos
    Barbearia.hasMany(models.GaleriaFotos, {
      foreignKey: 'id_barbearia',
      as: 'galeriaFotos'
    });

    // Uma Barbearia TEM MUITAS PaletaCores (1:N)
    // A FK (id_barbearia) está na tabela paleta_cores
    Barbearia.hasMany(models.PaletaCores, {
      foreignKey: 'id_barbearia',
      as: 'paletaCores'
    });

    // Uma Barbearia TEM MUITOS Relatorios (1:N)
    // A FK (id_barbearia) está na tabela relatorio
    Barbearia.hasMany(models.Relatorio, {
      foreignKey: 'id_barbearia',
      as: 'relatorios'
    });

    // Uma Barbearia pode ter FOTOS associadas (N:M através de foto_entidade)
    // Nota: FotoEntidade é uma tabela genérica. É um hasMany aqui, mas o relacionamento real é N:M via FotoEntidade e GaleriaFotos.
    Barbearia.hasMany(models.FotoEntidade, {
        foreignKey: 'id_referencia', // id_referencia na foto_entidade
        constraints: false, // Desabilita a FK enforcement do Sequelize, pois é uma tabela polimórfica
        scope: {
            tipo_entidade: 'barbearia' // Adiciona um escopo para filtrar por tipo de entidade
        },
        as: 'fotos'
    });
  };

  return Barbearia;
};