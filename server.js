const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models/index");
const auth = require("./app/config/passport.config")();
const passport = require('passport');
const {authJwt} = require('./app/middlewares/authJwt');
const validator = require('express-validator');


// API Routes
//const authRoutes = require('./app/routes/auth.routes');
//const eventRoutes = require('./app/routes/event.routes');
//const clubRoutes= require('./app/routes/club.routes');
//const clubInviteRoutes=require('./app/routes/club/invite.routes');

const app = express();

const corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// if you need to drop the existing table and resync database use {force: true}
db.sequelize.sync({ force: true })
  .then(() => {
    let hardcodedData = require('./app/config/db.hardcodeData');
    for(let i = 0; i < hardcodedData.length; i++) {
      let data = hardcodedData[i];
      data();
   }
});
//db.sequelize.sync();

/* file upload middleware
const fileUpload = require('express-fileupload');
app.use(fileUpload());
app.use('/images', express.static('images'));
*/

app.get("/", (req, res) => { res.json({ message: "Hello world!" });});
// API Routes
require('./app/routes/auth.routes')(app);
require('./app/routes/event.routes')(app);
require('./app/routes/club-request.routes')(app);
require('./app/routes/user.route.js')(app);

require('./app/routes/workout.route.js')(app);

require('./app/routes/club.routes.js')(app);

require('./app/routes/club-invite.routes.js')(app);

require('./app/routes/club-member.routes.js')(app);

require('./app/routes/event-member.routes.js')(app);
require('./app/routes/event-request.routes.js')(app);
require('./app/routes/event-invite.routes.js')(app);
require('./app/routes/coach.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Green team server is running on port ${PORT}.`);
});