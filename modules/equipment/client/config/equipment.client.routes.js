(function () {
  'use strict';

  angular
    .module('equipment')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('equipment', {
        abstract: true,
        url: '/equipment',
        template: '<ui-view/>'
      })
      .state('equipment.list', {
        url: '',
        templateUrl: 'modules/equipment/views/list-equipment.client.view.html',
        controller: 'EquipmentListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Equipment List'
        }
      })
      .state('equipment.create', {
        url: '/create',
        templateUrl: 'modules/equipment/views/form-equipment.client.view.html',
        controller: 'EquipmentController',
        controllerAs: 'vm',
        resolve: {
          equipmentResolve: newEquipment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Equipment Create'
        }
      })
      .state('equipment.edit', {
        url: '/:equipmentId/edit',
        templateUrl: 'modules/equipment/views/form-equipment.client.view.html',
        controller: 'EquipmentController',
        controllerAs: 'vm',
        resolve: {
          equipmentResolve: getEquipment
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Equipment {{ equipmentResolve.name }}'
        }
      })
      .state('equipment.view', {
        url: '/:equipmentId',
        templateUrl: 'modules/equipment/views/view-equipment.client.view.html',
        controller: 'EquipmentController',
        controllerAs: 'vm',
        resolve: {
          equipmentResolve: getEquipment
        },
        data: {
          pageTitle: 'Equipment {{ equipmentResolve.name }}'
        }
      });
  }

  getEquipment.$inject = ['$stateParams', 'EquipmentService'];

  function getEquipment($stateParams, EquipmentService) {
    return EquipmentService.get({
      equipmentId: $stateParams.equipmentId
    }).$promise;
  }

  newEquipment.$inject = ['EquipmentService'];

  function newEquipment(EquipmentService) {
    return new EquipmentService();
  }
}());
