const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models/index.js");
const jwtDecode = require('jwt-decode');

const User = db.User;


let getTokenPayload = (token) => {
    let decodedToken = jwtDecode(token);
    for(const [key, value] of Object.entries(decodedToken)) {
        if(key == 'role') {
            return value;
        }
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    let token = req.headers["authorization"];
    let decoded = getTokenPayload(token);
    if(decoded == 1) {
        next();
        return;
    }
    else {
        res.status(403).send({
            message: 'Admin role required'
        });
    }
}

exports.isCoach = (req, res, next) => {
    let token = req.headers["authorization"];
    let decoded = getTokenPayload(token);
    if(decoded == 2) {
        next();
        return;
    }
    else {
        res.status(403).send({
            message: 'Coach role required'
        });
    }
}


exports.isAthlete = (req, res, next) => {
    let token = req.headers["authorization"];
    let decoded = getTokenPayload(token);
    if(decoded == 1) {
        next();
        return;
    }
    else {
        res.status(403).send({
            message: 'Athlete role required'
        });
    }
}