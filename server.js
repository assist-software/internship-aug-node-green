const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models/index");
const auth = require("./app/config/passport.config")();
const passport = require('passport');
const {authJwt} = require('./app/middlewares/authJwt');
const validator = require('express-validator');
const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};


app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//initialize passport
app.use(auth.initialize());

// if you need to drop the existing table and resync database use {force: true}
db.sequelize.sync({ force: true })
  .then(() => {
    let hardcodedData = require('./app/config/db.hardcodeData');
    for(let i = 0; i < hardcodedData.length; i++) {
      let data = hardcodedData[i];
   }
});
//db.sequelize.sync();
const fileUpload = require('express-fileupload');

app.use(fileUpload());

// simple route
app.use('/images', express.static('images'));
app.get("/", (req, res) => { res.json({ message: "Hello world!" });});
// API Routes
require('./app/routes/auth.routes')(app);
require('./app/routes/event.routes')(app);
require('./app/routes/club-request.routes')(app);
require('./app/routes/user.route.js')(app);
require('./app/routes/club.routes.js')(app);
require('./app/routes/workout.route.js')(app);

app.get('/checkAuthenticate', auth.authenticate());

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Green team server is running on port ${PORT}.`);
});