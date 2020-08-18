const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");

const User = db.User;
/*
module.exports = isAdmin = (req, res, next) => {
    User.findOne({
        where: {
            id: payload.sub,
            //roleId: payload.role
        }
    })
    .then((user) => {
        if(user) {
            next();
            return;
        }
        else {
            return res.status(404).send({message: 'Required administrator role'});
        }
    })
    .catch((err) => {
        res.send({
            message: err.message
        })
    })
    
}

isCoach = (req, res, next) => {

}

isAthlete = (req, res, next) => {

}

const authJwt = {
    isAdmin: isAdmin,
    isCoach: isCoach,
    isAthlete: isAthlete
  };

  module.exports = authJwt;
  */