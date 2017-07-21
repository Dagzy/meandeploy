'use strict';

/**
 * Module dependencies
 */
var equipmentPolicy = require('../policies/equipment.server.policy'),
  equipment = require('../controllers/equipment.server.controller');

module.exports = function(app) {
  // Equipment Routes
  app.route('/api/equipment').all(equipmentPolicy.isAllowed)
    .get(equipment.list)
    .post(equipment.create);

  app.route('/api/equipment/:equipmentId').all(equipmentPolicy.isAllowed)
    .get(equipment.read)
    .put(equipment.update)
    .delete(equipment.delete);

  // Finish by binding the Equipment middleware
  app.param('equipmentId', equipment.equipmentByID);
};
