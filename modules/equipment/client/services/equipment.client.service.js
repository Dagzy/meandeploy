// Equipment service used to communicate Equipment REST endpoints
(function () {
  'use strict';

  angular
    .module('equipment')
    .factory('EquipmentService', EquipmentService);

  EquipmentService.$inject = ['$resource'];

  function EquipmentService($resource) {
    return $resource('api/equipment/:equipmentId', {
      equipmentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
