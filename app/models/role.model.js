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
    
    Role.sync().then(() => {
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