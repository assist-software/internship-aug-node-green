module.exports = (sequelize , Sequelize) => {
    const Event = sequelize.define("event",{
        name: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE
        },
        time: {
            type: Sequelize.TIME
        },
        description: {
            type: Sequelize.TEXT
        },        
        location: {
            type: Sequelize.STRING
        },
        club_id: {
            type: Sequelize.INTEGER
        },
        radius: {
            type: Sequelize.INTEGER
        },
        sport_type_id: {
            type: Sequelize.INTEGER
        },
        event_cover: {
            type: Sequelize.BLOB
        }
    });

    return Event;
};