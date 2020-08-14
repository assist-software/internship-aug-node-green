const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

const User = db.User;
/*
isAdmin = (req, res, next) => {
    /*
    User.findOne({
        where: {
            id: payload.sub
        }
    })
    .then((user) => {
        if(user.roleId == 1) {
            next();
            return;
        }
    })
    .catch((err) => {
        res.send({
            message: err.message
        })
    })
    
}
*/
/*
isCoach = (req, res, next) => {

}

isAthlete = (req, res, next) => {

}

const authJwt = {
    //verifyToken: verifyToken,
    isAdmin: isAdmin,
    isCoach: isCoach,
    isAthlete: isAthlete
  };

  module.exports = authJwt;

  */