'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Equipment = mongoose.model('Equipment'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  equipment;

/**
 * Equipment routes tests
 */
describe('Equipment CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Equipment
    user.save(function () {
      equipment = {
        name: 'Equipment name'
      };

      done();
    });
  });

  it('should be able to save a Equipment if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Equipment
        agent.post('/api/equipment')
          .send(equipment)
          .expect(200)
          .end(function (equipmentSaveErr, equipmentSaveRes) {
            // Handle Equipment save error
            if (equipmentSaveErr) {
              return done(equipmentSaveErr);
            }

            // Get a list of Equipment
            agent.get('/api/equipment')
              .end(function (equipmentGetErr, equipmentGetRes) {
                // Handle Equipment save error
                if (equipmentGetErr) {
                  return done(equipmentGetErr);
                }

                // Get Equipment list
                var equipment = equipmentGetRes.body;

                // Set assertions
                (equipment[0].user._id).should.equal(userId);
                (equipment[0].name).should.match('Equipment name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Equipment if not logged in', function (done) {
    agent.post('/api/equipment')
      .send(equipment)
      .expect(403)
      .end(function (equipmentSaveErr, equipmentSaveRes) {
        // Call the assertion callback
        done(equipmentSaveErr);
      });
  });

  it('should not be able to save an Equipment if no name is provided', function (done) {
    // Invalidate name field
    equipment.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Equipment
        agent.post('/api/equipment')
          .send(equipment)
          .expect(400)
          .end(function (equipmentSaveErr, equipmentSaveRes) {
            // Set message assertion
            (equipmentSaveRes.body.message).should.match('Please fill Equipment name');

            // Handle Equipment save error
            done(equipmentSaveErr);
          });
      });
  });

  it('should be able to update an Equipment if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Equipment
        agent.post('/api/equipment')
          .send(equipment)
          .expect(200)
          .end(function (equipmentSaveErr, equipmentSaveRes) {
            // Handle Equipment save error
            if (equipmentSaveErr) {
              return done(equipmentSaveErr);
            }

            // Update Equipment name
            equipment.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Equipment
            agent.put('/api/equipment/' + equipmentSaveRes.body._id)
              .send(equipment)
              .expect(200)
              .end(function (equipmentUpdateErr, equipmentUpdateRes) {
                // Handle Equipment update error
                if (equipmentUpdateErr) {
                  return done(equipmentUpdateErr);
                }

                // Set assertions
                (equipmentUpdateRes.body._id).should.equal(equipmentSaveRes.body._id);
                (equipmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Equipment if not signed in', function (done) {
    // Create new Equipment model instance
    var equipmentObj = new Equipment(equipment);

    // Save the equipment
    equipmentObj.save(function () {
      // Request Equipment
      request(app).get('/api/equipment')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Equipment if not signed in', function (done) {
    // Create new Equipment model instance
    var equipmentObj = new Equipment(equipment);

    // Save the Equipment
    equipmentObj.save(function () {
      request(app).get('/api/equipment/' + equipmentObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', equipment.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Equipment with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/equipment/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Equipment is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Equipment which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Equipment
    request(app).get('/api/equipment/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Equipment with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Equipment if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Equipment
        agent.post('/api/equipment')
          .send(equipment)
          .expect(200)
          .end(function (equipmentSaveErr, equipmentSaveRes) {
            // Handle Equipment save error
            if (equipmentSaveErr) {
              return done(equipmentSaveErr);
            }

            // Delete an existing Equipment
            agent.delete('/api/equipment/' + equipmentSaveRes.body._id)
              .send(equipment)
              .expect(200)
              .end(function (equipmentDeleteErr, equipmentDeleteRes) {
                // Handle equipment error error
                if (equipmentDeleteErr) {
                  return done(equipmentDeleteErr);
                }

                // Set assertions
                (equipmentDeleteRes.body._id).should.equal(equipmentSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Equipment if not signed in', function (done) {
    // Set Equipment user
    equipment.user = user;

    // Create new Equipment model instance
    var equipmentObj = new Equipment(equipment);

    // Save the Equipment
    equipmentObj.save(function () {
      // Try deleting Equipment
      request(app).delete('/api/equipment/' + equipmentObj._id)
        .expect(403)
        .end(function (equipmentDeleteErr, equipmentDeleteRes) {
          // Set message assertion
          (equipmentDeleteRes.body.message).should.match('User is not authorized');

          // Handle Equipment error error
          done(equipmentDeleteErr);
        });

    });
  });

  it('should be able to get a single Equipment that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Equipment
          agent.post('/api/equipment')
            .send(equipment)
            .expect(200)
            .end(function (equipmentSaveErr, equipmentSaveRes) {
              // Handle Equipment save error
              if (equipmentSaveErr) {
                return done(equipmentSaveErr);
              }

              // Set assertions on new Equipment
              (equipmentSaveRes.body.name).should.equal(equipment.name);
              should.exist(equipmentSaveRes.body.user);
              should.equal(equipmentSaveRes.body.user._id, orphanId);

              // force the Equipment to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Equipment
                    agent.get('/api/equipment/' + equipmentSaveRes.body._id)
                      .expect(200)
                      .end(function (equipmentInfoErr, equipmentInfoRes) {
                        // Handle Equipment error
                        if (equipmentInfoErr) {
                          return done(equipmentInfoErr);
                        }

                        // Set assertions
                        (equipmentInfoRes.body._id).should.equal(equipmentSaveRes.body._id);
                        (equipmentInfoRes.body.name).should.equal(equipment.name);
                        should.equal(equipmentInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Equipment.remove().exec(done);
    });
  });
});
