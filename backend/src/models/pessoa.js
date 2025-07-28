// src/models/pessoa.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pessoa = sequelize.define('Pessoa', {
    id_pessoa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_pessoa'
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Uma pessoa está ligada a UM usuário
      field: 'id_usuario'
    },
    nome_completo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'nome_completo'
    },
    celular: {
      type: DataTypes.STRING(14),
      field: 'celular',
      validate: {
        is: /^\+?[0-9\s\-\(\)]{10,}$/ // Corresponde à CONSTRAINT chk_celular_valido no DB
      }
    },
    cpf: {
      type: DataTypes.STRING(11),
      field: 'cpf',
      unique: true, // Embora não esteja explicitamente como UNIQUE KEY no DB para CPF, em Pessoa, geralmente deveria ser único.
                  // Se o DB tem CONSTRAINT chk_cpf_valido, você pode adicionar a validação aqui.
      validate: {
        is: /^[0-9]{11}$/ // Corresponde à CONSTRAINT chk_cpf_valido no DB
      }
    },
    genero: {
      type: DataTypes.STRING(9),
      field: 'genero',
      validate: {
        isIn: [['feminino', 'masculino', 'outros', null]] // Corresponde à CONSTRAINT chk_genero_valido no DB
      }
    },
    foto_perfil: {
      type: DataTypes.TEXT,
      field: 'foto_perfil'
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'status'
    },
    id_endereco: {
      type: DataTypes.INTEGER,
      field: 'id_endereco'
    }
  }, {
    tableName: 'pessoa', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Pessoa.associate = (models) => {
    // Uma Pessoa PERTENCE A UM Usuário (1:1)
    // A FK (id_usuario) está nesta tabela (pessoa)
    Pessoa.belongsTo(models.Usuario, {
      foreignKey: 'id_usuario',
      as: 'usuario'
    });

    // Uma Pessoa PERTENCE A UM Endereço (1:N, mas FK está em Pessoa)
    // A FK (id_endereco) está nesta tabela (pessoa)
    Pessoa.belongsTo(models.Endereco, {
      foreignKey: 'id_endereco',
      as: 'endereco'
    });

    // Uma Pessoa PODE SER UM Cliente (1:1 herança)
    // A FK (id_pessoa) está na tabela cliente
    Pessoa.hasOne(models.Cliente, {
      foreignKey: 'id_pessoa',
      as: 'clienteInfo'
    });

    // Uma Pessoa PODE SER UM Profissional (1:1 herança)
    // A FK (id_pessoa) está na tabela profissional
    Pessoa.hasOne(models.Profissional, {
      foreignKey: 'id_pessoa',
      as: 'profissionalInfo'
    });

    // Uma Pessoa PODE SER UM Proprietario (1:1 herança)
    // A FK (id_pessoa) está na tabela proprietario
    Pessoa.hasOne(models.Proprietario, {
      foreignKey: 'id_pessoa',
      as: 'proprietarioInfo'
    });
  };

  return Pessoa;
};