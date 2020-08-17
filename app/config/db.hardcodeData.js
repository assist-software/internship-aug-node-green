const db = require('../models/index');
const bcrypt = require('bcrypt');

let createRoleAdministrator = db.Role.create({
    name: 'Administrator',
    isAdmin: true
});
let createRoleCoach = db.Role.create({
  name: 'Coach',
  isAdmin: false
});
let createRoleAthlete = db.Role.create({
  name: 'Athlete',
  isAdmin: false
});
let createSportRunning = db.Sport.create({
  type:'Running'
});
let createSportCicling = db.Sport.create({
  type:'Cicling'
});
let createSportTeamsports = db.Sport.create({
  type:'TeamSports'
});
let createSportWeightlifting = db.Sport.create({
  type:'WeightLifting'
});
let createUserAdmin = db.User.create({
  first_name: 'admin',
  last_name: 'admin',
  email: 'admin@sport.ro',
  password: 'admin2020',
  roleId: 1
})

let createUserJohn = db.User.create({
    first_name: 'John',
    last_name: 'Andrew',
    email: 'johnandrew@andrew.com',
    password: bcrypt.hashSync('12345', 8),
    gender: 'm',
    height: 185,
    weight: 75,
    age: 25,
    roleId: '1',
    //primarySportId: '1',
    //secondarySportId: '2'
});



let createUserMike = db.User.create({
    first_name: 'Mike',
    last_name: 'Barrely',
    email: 'mikebarrely@barrely.com',
    password: bcrypt.hashSync('12345', 8),
    gender: 'm',
    height: 185,
    weight: 75,
    age: 25,
    roleId: '2',
    //primarySportId: '1',
    //secondarySportId: '2'
});

let createUserSarah = db.User.create({
    first_name: 'Sarah',
    last_name: 'Johnes',
    email: 'sarahjohnes@johnes.com',
    password: bcrypt.hashSync('12345', 8),
    gender: 'm',
    height: 185,
    weight: 75,
    age: 25,
    roleId: '3',
    //primarySportId: '1',
    //secondarySportId: '2'
});

let createClubRunners = db.Club.create({
    name: 'RunningClub'
});
let createClubTeamers = db.Club.create({
    name: 'TeamClub'
});
let createClubLifters = db.Club.create({
    name: 'LiftClub'
});

let createEventMarathon = db.Event.create({
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

let createEventTeamFest = db.Event.create({
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

let createEventLiftUp = db.Event.create({
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

module.exports = [
    // Production hardcoded data
    createRoleAdministrator, 
    createRoleCoach, 
    createRoleAthlete,
    createSportCicling,
    createSportRunning,
    createSportTeamsports,
    createSportWeightlifting,
    createUserAdmin,
    // Developement hardcoded data
    createUserJohn,
    createUserMike,
    createUserSarah,
    createClubRunners,
    createClubTeamers,
    createClubLifters,
    createEventMarathon,
    createEventTeamFest,
    createEventLiftUp
]