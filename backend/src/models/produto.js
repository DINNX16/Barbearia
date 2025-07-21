// src/models/produto.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Produto = sequelize.define('Produto', {
    id_produto: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id_produto' // Mapeia para o nome da coluna no DB
    },
    nome: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'nome'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'descricao'
    },
    preco_venda: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'preco_venda'
    },
    data_validade: {
      type: DataTypes.DATEONLY, // Usar DATEONLY para tipo DATE sem hora
      field: 'data_validade'
    },
    quantidade_estoque: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'quantidade_estoque'
    },
    estoque_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'estoque_minimo'
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      field: 'ativo'
    },
    categoria: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: 'categoria'
      // No DB tem CONSTRAINT chk_categoria, você pode replicar com validate: { isIn: [['cosmetico', 'equipamento', 'acessorio', 'outros']] }
    },
    preco_compra: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
      field: 'preco_compra'
    }
  }, {
    tableName: 'produto', // Nome exato da tabela no seu banco de dados
    timestamps: false // Baseado no seu DB Schema
  });

  Produto.associate = (models) => {
    // Um Produto PODE ESTAR EM MUITOS ITENS DE PEDIDO (1:N)
    // A FK (id_produto) está na tabela item_pedido
    Produto.hasMany(models.ItemPedido, {
      foreignKey: 'id_produto',
      as: 'itensDePedido'
    });

    // Um Produto PODE TER MUITAS PROMOÇÕES (1:N)
    // A FK (id_produto) está na tabela promocao_produto
    Produto.hasMany(models.PromocaoProduto, {
      foreignKey: 'id_produto',
      as: 'promocoes'
    });

    // Um Produto PODE TER MUITAS MOVIMENTAÇÕES DE ESTOQUE (1:N)
    // A FK (id_produto) está na tabela movimentacao_estoque
    Produto.hasMany(models.MovimentacaoEstoque, {
      foreignKey: 'id_produto',
      as: 'movimentacoesEstoque'
    });

    // Um Produto pode ter FOTOS associadas (N:M através de foto_entidade)
    // Mesma lógica da tabela Servico para polimorfismo
    Produto.hasMany(models.FotoEntidade, {
        foreignKey: 'id_referencia', // id_referencia na foto_entidade
        constraints: false, // Desabilita a FK enforcement do Sequelize
        scope: {
            tipo_entidade: 'produto' // Adiciona um escopo para filtrar por tipo de entidade
        },
        as: 'fotos'
    });
  };

  return Produto;
};