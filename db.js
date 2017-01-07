//load all modules into sequelize and then return that db connection to server.js which is going to call that file. server js requests db from db.js, db.js is going to return it so server.js can use it in api

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

//this looks at node environment variables. if the process.env.NODE_ENV is set for heroku, we use postgres for database, otherwise we use sqlite. as of now it is working on heroku
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
db.user = sequelize.import(__dirname+'/models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//foreign key set up to connect user and food list
db.item.belongsTo(db.user);
db.user.hasMany(db.item);
module.exports = db;
