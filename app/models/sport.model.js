module.exports=(sequelize,Sequelize)=>{
    const Sport=sequelize.define("sport",{
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey: true,
            allowNull:false
        },
        type:{
            type:Sequelize.STRING,
            allowNull:false
        }
    });
    return Sport;
}
