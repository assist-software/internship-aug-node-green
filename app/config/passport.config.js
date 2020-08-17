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

let userRole = null;

module.exports = function() {
    var strategy = new Strategy(params, (payload, done) => {
       User.findOne({
        where: {
            id: payload.sub
        }
       })
        .then((user) => {
            if(user) {
                /* --------------O sa finisez daca o sa am timp----------------
                if(user.roleId == 1) {
                    userRole = "Administrator";
                }
                else if(user.roleId == 2) {
                    userRole = "Coach";
                }
                else if(user.roleId == 3) {
                    userRole = "Athlete";
                }
                --------------------------------------------------------------*/
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
       
        /* ----------- o sa finisez daca o sa am timp-----------

       authenticateAdmin: function() {
        if(userRole == "Administrator") {
            return passport.authenticate("jwt", {
                session: false
                successRedirec
            });
        }
       },
       */
       /*
       authenticateCoach: function() {
        if(userRole == "Coach") {
            return passport.authenticate("jwt", {session: false});
        }
       },
       authenticateAthlete: function() {
        if(userRole == "Athlete") {
            return passport.authenticate("jwt", {session: false});
        }
       }
       ------------------------------------------------------*/
    }
};