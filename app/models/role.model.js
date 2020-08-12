module.exports = (sequelize, Sequelize) => {
    console.log('Creating Role');

    const Role = sequelize.define("role", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isAdmin: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        
    });
<<<<<<< HEAD
    Role.sync({force:true}).then(() => {
=======
    
    Role.sync().then(() => {
>>>>>>> bc69a5742830f7a43e7f598d3a53e8cf6c10b305
        Role.create({
            name: 'Administrator',
            isAdmin: true
        })
        Role.create({
            name: 'Coach',
            isAdmin: false
        });
        Role.create({
            name: 'Athlete',
            isAdmin: false
        })
    })
    return Role;
}