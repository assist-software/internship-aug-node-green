module.exports = (sequelize , Sequelize) => {
    const Event = sequelize.define("event",{
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        date: {
            type: Sequelize.DATE,
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
        club_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        radius: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        sport_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        event_cover: {
            type: Sequelize.BLOB,
            allowNull: true
        }
    },{underscored: true});

    return Event;
};