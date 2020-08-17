var bcrypt = require('bcryptjs');
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
       id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
       },
       first_name: {
        type: Sequelize.STRING,
        allowNull: true
       },
       last_name: {
        type: Sequelize.STRING,
        allowNull: true
       },
       email: {
        type: Sequelize.STRING,
        allowNull: false
       },
       password: {
        type: Sequelize.STRING,
        allowNull: false
       },
       gender: {
        type: Sequelize.STRING,
        allowNull: true
       },
       height: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       weight: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       age: {
        type: Sequelize.INTEGER,
        allowNull: true
       },
       profile_photo: {
        type: Sequelize.BLOB,
        allowNull: true
       }
    });
    return User;
};