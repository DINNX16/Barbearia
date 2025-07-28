// src/models/profissional.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Profissional = sequelize.define('Profissional', {
    id_profissional: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_profissional'
    },
    id_pessoa: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Um profissional é UMA pessoa específica
      field: 'id_pessoa'
    },
    especializacao: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: 'especializacao'
    },
    biografia: {
      type: DataTypes.STRING(100),
      field: 'biografia'
    },
    observacoes: {
      type: DataTypes.STRING(45),
      field: 'observacoes'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'status'
    }
  }, {
    tableName: 'profissional', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Profissional.associate = (models) => {
    // Um Profissional PERTENCE A UMA Pessoa (1:1 herança)
    // A FK (id_pessoa) está nesta tabela (profissional)
    Profissional.belongsTo(models.Pessoa, {
      foreignKey: 'id_pessoa',
      as: 'pessoa'
    });

    // Um Profissional TEM MUITOS Agendamentos (1:N)
    // A FK (id_profissional) está na tabela agendamento
    Profissional.hasMany(models.Agendamento, {
      foreignKey: 'id_profissional',
      as: 'agendamentos'
    });

    // Um Profissional TEM MUITAS Disponibilidades (1:N)
    // A FK (id_profissional) está na tabela disponibilidade_profissional
    Profissional.hasMany(models.DisponibilidadeProfissional, {
      foreignKey: 'id_profissional',
      as: 'disponibilidades'
    });

    // Um Profissional TEM MUITAS Exceções de Disponibilidade (1:N)
    // A FK (id_profissional) está na tabela excecoes_disponibilidade
    Profissional.hasMany(models.ExcecaoDisponibilidade, {
      foreignKey: 'id_profissional',
      as: 'excecoesDisponibilidade'
    });

    // Um Profissional PODE REALIZAR MUITOS SERVIÇOS (N:M através de profissional_servico)
    // A tabela de junção é 'profissional_servico'
    Profissional.belongsToMany(models.Servico, {
      through: 'ProfissionalServico', // Nome do modelo da tabela de junção (você não precisa criar este modelo, ele será inferido)
      foreignKey: 'id_profissional', // FK na tabela de junção que aponta para Profissional
      otherKey: 'id_servico',       // FK na tabela de junção que aponta para Servico
      as: 'servicosOferecidos'
    });

    // Um Profissional pode ter FOTOS associadas (N:M através de foto_entidade)
    // Nota: FotoEntidade é uma tabela genérica. É um hasMany aqui, mas o relacionamento real é N:M via FotoEntidade e GaleriaFotos.
    Profissional.hasMany(models.FotoEntidade, {
        foreignKey: 'id_referencia', // id_referencia na foto_entidade
        constraints: false, // Desabilita a FK enforcement do Sequelize, pois é uma tabela polimórfica
        scope: {
            tipo_entidade: 'profissional' // Adiciona um escopo para filtrar por tipo de entidade
        },
        as: 'fotos'
    });
  };

  return Profissional;
};