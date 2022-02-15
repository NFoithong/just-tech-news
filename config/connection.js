// import the Sequelize constructor from the library
const Sequelize = require('sequelize');
// import environment variable from .env (npm install dotenv)
require('dotenv').config();

// create connection to our database, pass in your mysql information for username and password
// const sequelize = new Sequelize('just_tech_news_db', 'username', 'password', {
//     host: 'localhost',
//     dialect: 'mysql',
//     port: 3306
// });

// update code databse username and password when set up env
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;