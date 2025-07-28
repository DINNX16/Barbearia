// src/models/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize'); // <<<<< Mudei AQUI: adicionei 'Sequelize'

const basename = path.basename(__filename);
const db = {};

module.exports = (sequelize) => {
  fs
    .readdirSync(__dirname)
    .filter(file => {
      // Filtra para pegar apenas arquivos .js que não sejam o próprio index.js
      return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
      // Importa cada modelo e o adiciona ao objeto db
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      db[model.name] = model;
    });

  // Itera sobre todos os modelos carregados e chama a função associate se ela existir
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize; // Agora 'Sequelize' estará definido, porque foi importado acima

  return db;
};