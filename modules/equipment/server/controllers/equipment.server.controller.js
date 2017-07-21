'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Equipment = mongoose.model('Equipment'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Equipment
 */
exports.create = function(req, res) {
  var equipment = new Equipment(req.body);
  equipment.user = req.user;

  equipment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(equipment);
    }
  });
};

/**
 * Show the current Equipment
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var equipment = req.equipment ? req.equipment.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  equipment.isCurrentUserOwner = req.user && equipment.user && equipment.user._id.toString() === req.user._id.toString();

  res.jsonp(equipment);
};

/**
 * Update a Equipment
 */
exports.update = function(req, res) {
  var equipment = req.equipment;

  equipment = _.extend(equipment, req.body);

  equipment.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(equipment);
    }
  });
};

/**
 * Delete an Equipment
 */
exports.delete = function(req, res) {
  var equipment = req.equipment;

  equipment.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(equipment);
    }
  });
};

/**
 * List of Equipment
 */
exports.list = function(req, res) {
  Equipment.find().sort('-created').populate('user', 'displayName').exec(function(err, equipment) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(equipment);
    }
  });
};

/**
 * Equipment middleware
 */
exports.equipmentByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Equipment is invalid'
    });
  }

  Equipment.findById(id).populate('user', 'displayName').exec(function (err, equipment) {
    if (err) {
      return next(err);
    } else if (!equipment) {
      return res.status(404).send({
        message: 'No Equipment with that identifier has been found'
      });
    }
    req.equipment = equipment;
    next();
  });
};
