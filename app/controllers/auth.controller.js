const db = require('../models/index.js');
const secretKeyConfig = require('../config/auth.config.js');
const User = db.User;
const Role = db.Role;

const Op = db.Sequelize.Op;

const mail = require('../utils/email.utils');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

const userRoles = {
    1: "Administrator",
    2: "Coach",
    3: "Athlete"
}

exports.login = (req, res) => {
    
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({
                accessToken: null,
                message: "User not found"
            });
        }

        var passwordIsValid = bcrypt.compare(req.body.password, user.password, (error, resolve) => {
            if(resolve) {
                
                const token = jwt.sign({sub: user.id}, secretKeyConfig.secret, {
                    expiresIn: 86400
                });
         
                res.status(200).send({
                    id: user.id,
                    accessToken: token,
                    user_firstname: user.first_name,
                    user_lastname: user.last_name,
                    user_email: user.email,
                    user_gender: user.gender,
                    user_roleid: userRoles[user.roleId]
                });
            }
            else {
                return res.status(404).send({
                    accessToken: null,
                    message: "Password is not valid"
                });
            }
        });
    })
    .catch(err => {
        res.send({err: err.message});
    });

}

exports.reset = (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {
            return res.status(404).send({message: "User with this email not found!!"});
        }
        //Generating a random number from 10000 to 99999
        let newPass = Math.floor(Math.random()*99999) +10000; 
        let newHashPass = bcrypt.hashSync(`${newPass}`, 10);
        
        user.password = newHashPass;
        user.save();
        mail(`You new password is ${newPass}`, [user.email]);

        return res.send({message: 'password reset succes'});
    })
    .catch(err => {
        res.status(404).send({error: err.message});
    });
}