const db = require('../models/index.js');
const secretKeyConfig = require('../config/auth.config.js');

//Passport requirements
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const User = db.User;

const params = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: secretKeyConfig.secret
};

module.exports = function() {
    var strategy = new Strategy(params, (payload, done) => {
       User.findOne({
        where: {
            id: payload.sub
        }
       })
        .then((user) => {
            if(user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
        .catch(err => done(err, null))
    })

    passport.use(strategy);

    return {
        initialize: function() {
            return passport.initialize();
        },
        
        authenticate: function() {
            return passport.authenticate("jwt", {session: false});
        }, 
    }
};