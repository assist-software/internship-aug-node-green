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
db.Sport=require("./sport.model.js")(sequelize,Sequelize);
db.User = require("./user.model.js")(sequelize, Sequelize);

db.Club=require("./club.model.js")(sequelize,Sequelize);
db.ClubMember = require("./club-member.model.js")(sequelize, Sequelize);
db.ClubInvite = require("./club-invite.model.js")(sequelize, Sequelize);
db.ClubRequest = require("./club-request.model.js")(sequelize, Sequelize);

db.Event = require("./event.model")(sequelize, Sequelize);
db.EventInvite = require("./event-invite.model.js")(sequelize, Sequelize);
db.EventRequest = require("./event-request.model.js")(sequelize,Sequelize);
db.EventMember = require("./event-member.model.js")(sequelize,Sequelize);

db.Workout = require("./workout.model.js")(sequelize, Sequelize);

//Club assosiations
/*
db.ClubInvite.belongsTo(db.Club);
db.ClubRequest.belongsTo(db.Club);
*/

//event assosiations
db.EventInvite.belongsTo(db.Event);
db.EventRequest.belongsTo(db.Event);
db.EventRequest.belongsTo(db.User,{allowNull: false});
db.Event.belongsTo(db.Sport, {allowNull: false});
db.Event.belongsTo(db.Club);
db.EventMember.belongsTo(db.User,{allowNull: false});
db.EventMember.belongsTo(db.Event,{allowNull: false});

//club assosiations
db.Club.belongsTo(db.User,{as:'owner'});

db.ClubInvite.belongsTo(db.Club,{
  allowNull:false
});

db.ClubRequest.belongsTo(db.User),{
  allowNull:false
};
db.ClubRequest.belongsTo(db.Club,{
  allowNull:false
});

db.ClubMember.belongsTo(db.User),{
  allowNull:false
};
db.ClubMember.belongsTo(db.Club,{
  allowNull:false
});

// User assosiations
console.log(db.Sport);
db.User.belongsTo(db.Role), {
  allowNull: false
};

db.User.belongsTo(db.Sport, {
  as: 'primary_sport',
  allowNull: true
});
db.User.belongsTo(db.Sport, {
  as: 'secondary_sport',
  allowNull: true
});

//Workout assosiations
db.Workout.belongsTo(db.User, {
  as: 'user',
  allowNull: false
})
db.Workout.belongsTo(db.Event, {
  as: 'event',
  allowNull: false
})

module.exports = db;