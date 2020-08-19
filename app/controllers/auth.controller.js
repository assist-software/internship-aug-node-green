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

// Login controller
exports.login = (req, res) => {
    
    // Cautare user dupa email
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user) {
            // Daca userul nu a fost gasit, 404
            return res.status(404).send({
                accessToken: null,
                message: "User not found"
            });
        }

        // Daca userul a fost gasit comparam hash-ul parolei introduse cu cea din db
        var passwordIsValid = bcrypt.compare(req.body.password, user.password, (error, resolve) => {
            if(resolve) {
                // Daca userul a fost autentificat, generam un token
                const token = jwt.sign({
                    sub: user.id,
                    role: user.roleId
                }, secretKeyConfig.secret, {
                    expiresIn: 86400
                });
                // Dupa generarea tokenului, transmitem ca raspuns un obiect cu datele necesare despre user
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
                // Daca emailul userului a fost corect, dar parola gresita, 404
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

// Controllerul pentru resetarea parolei
exports.reset = (req, res) => {
    // Cautam userul dupa email
    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        // Daca userul nu a fost gasit, 404
        if(!user) {
            return res.status(404).send({message: "User with this email not found!!"});
        }
        // Daca userul a fost gasit, generam o parola noua
        let newPass = Math.floor(Math.random()*99999) +10000; 
        let newHashPass = bcrypt.hashSync(`${newPass}`, 10);

        // Setare in db parola noua
        user.password = newHashPass;
        user.save();

        // Trimitem un mesaj pe emailul userului cu parola noua
        mail(`You new password is ${newPass}`, [user.email]);
        return res.send({message: 'password reset succes'});
    })
    .catch(err => {
        res.status(404).send({error: err.message});
    });
}