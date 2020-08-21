const db = require('../models/index');
const bcrypt = require('bcrypt');

exports.populateDb = () => {
    db.Role.create({
        name: 'Administrator',
        isAdmin: true
    });
    db.Role.create({
      name: 'Coach',
      isAdmin: false
    });
    db.Role.create({
      name: 'Athlete',
      isAdmin: false
    });
    db.Sport.create({
      type:'Running'
    });
    db.Sport.create({
      type:'Cicling'
    });
    db.Sport.create({
      type:'TeamSports'
    });
    db.Sport.create({
      type:'WeightLifting'
    });
    db.User.create({
        first_name: 'John',
        last_name: 'Andrew',
        email: 'johnandrew@andrew.com',
        password: bcrypt.hashSync('123456789', 10),
        gender: 'm',
        height: 185,
        weight: 75,
        age: 25,
        roleId: '1'
    });
    
    db.User.create({
      first_name: 'Udisteanu',
      last_name: 'Iulian-Elisei',
      email: 'udisteanu.iulian@outlook.com',
      password: bcrypt.hashSync('12345', 10),
      gender: 'm',
      height: 185,
      weight: 75,
      age: 23,
      roleId: '1'
    });
    
    db.User.create({
      first_name: 'Iulian Bot',
      last_name: 'Iulian-Elisei',
      email: 'iulianbot@bot.com',
      password: bcrypt.hashSync('123456789', 10),
      gender: 'Male',
      height: 185,
      weight: 75,
      age: 23,
      roleId: '3'
    });
    
    
    db.User.create({
        first_name: 'Mike',
        last_name: 'Barrely',
        email: 'mikebarrely@barrely.com',
        password: bcrypt.hashSync('12345', 10),
        gender: 'm',
        height: 185,
        weight: 75,
        age: 25,
        roleId: '2'
    });
    
    db.User.create({
        first_name: 'Sarah',
        last_name: 'Johnes',
        email: 'sarahjohnes@johnes.com',
        password: bcrypt.hashSync('123456789', 10),
        gender: 'm',
        height: 185,
        weight: 75,
        age: 25,
        roleId: '3'
    });
    
    db.User.create({
      first_name: 'Valentin',
      last_name: 'Stratan',
      email: 'valentin.stratan83@gmail.com',
      password: bcrypt.hashSync('12345', 10),
      gender: 'm',
      age: 25,
      roleId: '1'
    });
    
   db.User.create({
      first_name: 'John',
      last_name: 'Sharp',
      email: 'john.sharp@sharp.com',
      password: bcrypt.hashSync('12345', 10),
      gender: 'm',
      age: 25,
      roleId: '2'
    });
    
    db.Club.create({
        name: 'RunningClub',
        ownerId: 4
    });
    db.Club.create({
        name: 'TeamClub',
        ownerId: 7
    });
    db.Club.create({
        name: 'LiftClub',
        ownerId: 3,
    });
    db.Club.create({
      name: 'RunningClubv2',
      ownerId: 4
    });
     db.Club.create({
      name: 'TeamClubv2',
      ownerId: 4
    });
    db.Club.create({
      name: 'LiftClubv2',
      ownerId: 7
    });
    
    db.Event.create({
        clubId: 1,
        name: 'Marathon',
        date: '10.10.2021',
        time: '13:00',
        description: 'A running challange',  
        location: 'Suceava',
        radius: 10,
        sportId: 1,
        event_cover: null
    });
    
    db.Event.create({
        clubId: 1,
        name: 'TeamFest',
        date: '11.10.2021',
        time: '14:00',
        description: 'Win with your team',  
        location: 'Suceava',
        radius: 10,
        sportId: 2,
        event_cover: null
    });
    
     db.Event.create({
        clubId: 1,
        name: 'LiftUp',
        date: '12.10.2021',
        time: '15:00',
        description: 'Lift the world',  
        location: 'Suceava',
        radius: 10,
        sportId: 3,
        event_cover: null
    });
}