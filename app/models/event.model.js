module.exports = (sequelize , Sequelize) => {
    const Event = sequelize.define("event",{
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        time: {
            type: Sequelize.TIME,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },        
        location: {
            type: Sequelize.STRING,
            allowNull: false
        },
        radius: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        event_cover: {
            type: Sequelize.BLOB,
            allowNull: true
        }
    });

    return Event;
};