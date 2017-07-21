'use strict';

describe('Equipment E2E Tests:', function () {
  describe('Test Equipment page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/equipment');
      expect(element.all(by.repeater('equipment in equipment')).count()).toEqual(0);
    });
  });
});
