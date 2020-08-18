const db = require("../models");
const { body, validationResult  }  = require('express-validator');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const User = db.User;
//create User method
exports.create = (req ,res, next) => {
    //Validate request 
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    /*
    const {img_name, img_data} = req.files.pic;
    if(img_name && img_data) {
        User.create({
            profile_photo: img_data
        })
    }

    const id = req.parmas.id;
    User.findOne({
        where: {
            id: id
        }
    })
    .then(user => {
        if(user) {
            res.send({image: user.profile_photo})
        }
    })
    */
    const { first_name, last_name, email, password, roleId, gender, primarySport, secondarySport, heigt, weight, age, profile_photo} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    User.create({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        roleId,
        gender,
        primarySport,
        secondarySport,
        heigt,
        weight,
        age,
        profile_photo
    }).then(data => {
        //console.log(req.file.path);
        res.status(200).json(data);
    })
    .catch(err => {
        res.status(500).send({message: err.message});
    })
};

//update User method
exports.update = (req, res, next) => {
    const id = req.params.userId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }
    if(req.body.email !== undefined){
        req.body.email = req.body.newEmail;
    }
    if(req.body.password !== undefined){
        req.body.password = bcrypt.hash(req.body.password,10);
    }
    User.update(req.body,{ where: {id: id} })
        .then(num => {
            if (num == 1) {
              res.send({
                message: "User was updated successfully."
              });
            } else {
              res.send({
                message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
              });
            }
        })
        .catch(err => {
            res.status(500).send({
            message: "Error updating User with id=" + id});
        });

};

//get User method
exports.get = (req, res) => {
    const id = req.params.userId;

    User.findByPk(id)
        .then(user => {
            if(user){
                res.status(200).send(user);
            }
            else{
                res.status(404).send();
            }
        })
        .catch(err => {
            res.status(500).send({
                message: `Error retrieving User with id= ${id}`
            });
        });
};

//delete User method

exports.delete = (req, res) => {
    const id = req.params.userId;
    
    User.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
              res.status(200).send();
          } else {
              res.status(404).send();
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete User with id=" + id
          });
        });
};

//search User by first_name or last_name

exports.search = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
    }

    const { search_query } = req.body;

    User.findAll()
        .then(users => {
            const newArray = users.filter(user => {
                return (user.first_name + ' ' + user.last_name).includes(search_query);
            });
            res.status(200).send(newArray);
        })
        .catch(err =>{
            res.status(404).send();
        });
};

exports.validate = (method) => {
    switch(method) {
        case 'create': {
            return [
                body(['first_name','last_name','gender']).optional().isString(),
                body('email').exists().notEmpty().isEmail().custom(value => {
                    return User.findOne({ where: {email: value}} ).then(user => {
                        if(user){
                            throw new Error('Email already in use!!');
                        }
                    })
                }),
                body('password','invalid password').exists().isString().notEmpty().custom((value , { req }) => {
                    if(value !== req.body.confirm_password) {
                        throw new Error('Password confirmation does not match password');
                    }
                    return true;
                }),
                body('roleId').exists().isInt(),
                body(['primarySport','secondarySport','height','weight','age']).optional().isInt(),
                body('profile_photo').optional()
            ]
            break;
        }
        case 'update' : {
            return [
                body(['first_name','last_name','gender']).optional().isString(),
                body('email').optional().isEmail().custom((value, {req}) => {
                    if(value === req.body.newEmail){
                        return true;
                    }
                    if(req.body.newEmail == undefined){
                        throw new Error('newEmail is undefined!!');
                    }
                    return User.findOne({ where: {email: req.body.newEmail}} ).then(user => {
                        if(user){
                            throw new Error('Email already in use!!');
                        }
                    })
                }),
                body('password').optional().isString().notEmpty().custom((value, {req}) =>{ 
                    if(value !== req.body.confirm_password) {
                        throw new Error('Password confirmation does not match password');
                    }
                    return true;
                }),
                body('roleId').optional().isInt(),
                body(['primarySport','secondarySport','height','weight','age']).optional().isInt(),
                body('profile_photo').optional()
            ]
            break;
        }
        case 'search' : {
            return [
                body('search_query').exists().withMessage(`search_query does not exist!!`).isString().withMessage('search_query must be a string')
            ]
            break;
        }
    }
};