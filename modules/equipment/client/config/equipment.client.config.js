(function () {
  'use strict';

  angular
    .module('equipment')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Equipment',
      state: 'equipment',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'equipment', {
      title: 'List Equipment',
      state: 'equipment.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'equipment', {
      title: 'Create Equipment',
      state: 'equipment.create',
      roles: ['user']
    });
  }
}());
