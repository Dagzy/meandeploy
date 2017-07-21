(function () {
  'use strict';

  angular
    .module('equipment')
    .controller('EquipmentListController', EquipmentListController);

  EquipmentListController.$inject = ['EquipmentService'];

  function EquipmentListController(EquipmentService) {
    var vm = this;

    vm.equipment = EquipmentService.query();
  }
}());
