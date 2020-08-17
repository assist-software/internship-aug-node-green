module.exports = (sequelize, Sequelize) => {
    const Workout = sequelize.define("workout", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        // User ID assosiation
        duration: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        heart_rate: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        calories: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        avg_speed: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        distance: {
            type: Sequelize.DOUBLE,
            allowNull: false
        },
        workout_effectiveness: {
            type: Sequelize.STRING,
            allowNull: false
        }
        // Event ID assosiation
    });
    return Workout;
}