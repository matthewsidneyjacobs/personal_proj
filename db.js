//load all modules into sequelize and then return that db connection to server.js which is going to call that file. server js requests db from db.js, db.js is going to return it so server.js can use it in api

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
  });
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname+'/data/dev-food-api.sqlite'
  });
}

var db = {};

db.item = sequelize.import(__dirname+'/models/item.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
