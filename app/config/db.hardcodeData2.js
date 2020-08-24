const db = require('../models/index');
const bcrypt = require('bcrypt');

exports.populateDb = async () => {
  try {


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
      type: 'Running'
    });
    db.Sport.create({
      type: 'Cicling'
    });
    db.Sport.create({
      type: 'TeamSports'
    });
    db.Sport.create({
      type: 'WeightLifting'
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
      roleId: '1',
      profile_photo: 'images/no_image.jpg'
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
      roleId: '1',
      profile_photo: 'images/no_image.jpg'
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
      roleId: '3',
      primarySportId: 1,
      secondarySportId: 2,
      profile_photo: 'images/no_image.jpg'
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
      roleId: '2',
      profile_photo: 'images/no_image.jpg'
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
      roleId: '3',
      profile_photo: 'images/no_image.jpg'
    });

    db.User.create({
      first_name: 'Valentin',
      last_name: 'Stratan',
      email: 'valentin.stratan83@gmail.com',
      password: bcrypt.hashSync('12345', 10),
      gender: 'm',
      age: 25,
      roleId: '1',
      profile_photo: 'images/no_image.jpg'
    });

    db.User.create({
      first_name: 'John',
      last_name: 'Sharp',
      email: 'john.sharp@sharp.com',
      password: bcrypt.hashSync('12345', 10),
      gender: 'm',
      age: 25,
      roleId: '2',
      profile_photo: 'images/no_image.jpg'
    });

    db.Club.create({
      name: 'RunningClub',
      ownerId: 4,
      sportId: 1
    });
    db.Club.create({
      name: 'TeamClub',
      ownerId: 7,
      sportId: 2
    });
    db.Club.create({
      name: 'LiftClub',
      ownerId: 3,
      sportId: 3
    });
    db.Club.create({
      name: 'RunningClubv2',
      ownerId: 4,
      sportId: 1
    });
    db.Club.create({
      name: 'TeamClubv2',
      ownerId: 4,
      sportId: 2
    });
    db.Club.create({
      name: 'LiftClubv2',
      ownerId: 7,
      sportId: 3
    });

    db.Event.create({
      clubId: 3,
      name: 'Marathon',
      date: '10.10.2021',
      time: '13:00',
      description: 'A running challange',
      location: 'Suceava',
      radius: 10,
      sportId: 1,
      event_cover: 'images/event_cover_1598176327559.jpg'
    });

    db.Event.create({
      clubId: 6,
      name: 'TeamFest',
      date: '11.10.2021',
      time: '14:00',
      description: 'Win with your team',
      location: 'Suceava',
      radius: 10,
      sportId: 3,
      event_cover: 'images/event_cover_1598177447621.jpg'
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
      event_cover: 'images/no_image.jpg'
    });

    db.Workout.create({
      userId: 5,
      eventId: 1,
      duration: 1.30,
      heart_rate: 80,
      calories: 300,
      avg_speed: 15,
      distance: 10,
      workout_effectiveness: 'Effective'
    });

    db.ClubMember.create({
      userId: 1,
      clubId: 1
    });

    db.ClubMember.create({
      userId: 2,
      clubId: 1
    });

    db.ClubMember.create({
      userId: 3,
      clubId: 3
    });

    db.ClubMember.create({
      userId: 4,
      clubId: 2
    });

    db.ClubMember.create({
      userId: 3,
      clubId: 6
    });

    db.ClubRequest.create({
      userId: 3,
      clubId: 3
    });

    db.ClubRequest.create({
      userId: 3,
      clubId: 4
    });

    db.EventMember.create({
      userId: 3,
      eventId: 1
    });

    db.EventRequest.create({
      userId: 3,
      eventId: 2
    });

  }
  catch (err) {
    console.log(err.message);
  }
}