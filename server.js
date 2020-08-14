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
// initialize validator
//app.use(validator());
//initialize passport
app.use(auth.initialize());
// if you need to drop the existing table and resync database use {force: true}
//db.sequelize.sync({ force: true })
db.sequelize.sync();


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});

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