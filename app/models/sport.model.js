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
    
    Sport.sync().then(()=>{
        Sport.create({
            type:'Running'
        });
        Sport.create({
            type:'Cicling'
        });
        Sport.create({
            type:'TeamSports'
        });
        Sport.create({
            type:'WeightLifting'
        });

    })
    return Sport;
}
