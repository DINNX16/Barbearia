require('dotenv').config(); 

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234567',
    database: process.env.DB_NAME || 'barbearia',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: true
  },
};