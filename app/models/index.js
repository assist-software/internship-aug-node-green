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
db.Event = require("./event.model1")(sequelize, Sequelize);
db.EventInvite = require("./event-invite.model.js")(sequelize, Sequelize);
db.EventRequest = require("./event-request.model.js")(sequelize,Sequelize);

db.EventInvite.belongsTo(db.Event);
db.EventRequest.belongsTo(db.Event);
db.Role = require("./role.model.js")(sequelize, Sequelize);

db.Sport=require("./sport.model.js")(sequelize,Sequelize);
db.Club=require("./club.model.js")(sequelize,Sequelize);
db.ClubInvite = require("./club-invite.model.js")(sequelize, Sequelize);
db.ClubRequest = require("./club-request.model.js")(sequelize, Sequelize);

db.ClubInvite.belongsTo(db.Club);
db.ClubRequest.belongsTo(db.Club);
=======
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

>>>>>>> bc69a5742830f7a43e7f598d3a53e8cf6c10b305
module.exports = db;