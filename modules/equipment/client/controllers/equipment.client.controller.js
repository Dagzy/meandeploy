(function () {
  'use strict';

  // Equipment controller
  angular
    .module('equipment')
    .controller('EquipmentController', EquipmentController);

  EquipmentController.$inject = ['$scope', '$state', '$window', 'Authentication', 'equipmentResolve'];

  function EquipmentController ($scope, $state, $window, Authentication, equipment) {
    var vm = this;

    vm.authentication = Authentication;
    vm.equipment = equipment;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Equipment
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.equipment.$remove($state.go('equipment.list'));
      }
    }

    // Save Equipment
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.equipmentForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.equipment._id) {
        vm.equipment.$update(successCallback, errorCallback);
      } else {
        vm.equipment.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('equipment.view', {
          equipmentId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
