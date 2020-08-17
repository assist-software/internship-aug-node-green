const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models/index");
const auth = require("./app/config/passport.config")();
const passport = require('passport');
const {authJwt} = require('./app/middlewares/authJwt');
const validator = require('express-validator');


// API Routes
const authRoutes = require('./app/routes/auth.routes');
const eventRoutes = require('./app/routes/event.routes');

const corsOptions = {
  origin: "http://localhost:8081"
};

const app = express();
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// user express - validator
//app.use(expressValidator);
// initialize validator


//app.use(validator());
//initialize passport
app.use(auth.initialize());
// if you need to drop the existing table and resync database use {force: true}
/*
db.sequelize.sync({ force: true }).then(() => {
  db.Role.create({
      name: 'Administrator',
      isAdmin: true
  });
  db.Role.create({
    name: 'Coach',
    isAdmin: false
  });
  db.Role.create({
    name: 'Athlete',
    isAdmin: false
  });
  db.Sport.create({
    type:'Running'
  });
  db.Sport.create({
    type:'Cicling'
  });
  db.Sport.create({
    type:'TeamSports'
  });
  db.Sport.create({
    type:'WeightLifting'
  });
  db.User.create({
    first_name: 'admin',
    last_name: 'admin',
    email: 'admin@sport.ro',
    password: 'admin2020',
    roleId: 1
  })
});
*/
db.sequelize.sync();


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

require('./app/routes/user.route.js')(app);
// authentification routes
app.use(authRoutes);

// event api routes
app.use('/api/event', eventRoutes);

app.get('/checkAuthorization', auth.authenticate(), (req, res) => {
  res.status(200).send({
    message: "Authorized"
  });
});


// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Green team server is running on port ${PORT}.`);
});