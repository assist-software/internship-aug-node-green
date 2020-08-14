const db = require('../models/index.js');
const secretKeyConfig = require('../config/auth.config.js');
const User = db.User;
const Role = db.Role;

const Op = db.Sequelize.Op;

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
