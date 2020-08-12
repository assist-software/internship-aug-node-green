const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});


// Define all models here like this:
// db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.Role = require("./role.model.js")(sequelize, Sequelize);
db.Sport = require("./sport.model.js")(sequelize,Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);

// User assosiations
console.log(db.Sport);
db.User.belongsTo(db.Role);

db.User.belongsTo(db.Sport, {
  as: 'primary_sport'
});
db.User.belongsTo(db.Sport, {
  as: 'secondary_sport'
});

module.exports = db;