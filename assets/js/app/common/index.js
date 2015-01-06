'use strict';

var angular = require('angular');

module.exports = angular.module('broker.common', [
  require('./exception_handler').name,
  require('./constants').name
])
  .factory('ApiResource', require('./api_resource'))
  .factory('DataService', require('./data_service'))
  .factory('httpInterceptor', require('./http_interceptor'))
  .factory('JellyfishModal', require('./jellyfish_modal'))
  .directive('sectionHeader', require('./section_header_directive'))
  .directive('compareTo', require('./compare_to_directive'))
  .config(require('./routes'));
