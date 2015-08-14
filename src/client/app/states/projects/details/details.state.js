(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'projects.details': {
        url: '/:projectId',
        templateUrl: 'app/states/projects/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Project Details',
        resolve: {
          project: resolveProject,
          services: resolveServices,
          memberships: resolveMemberships
        }
      }
    };
  }

  /** @ngInject */
  function resolveProject($stateParams, Project) {
    return Project.get({
      id: $stateParams.projectId,
      'includes[]': ['latest_alerts', 'approvals', 'approvers', 'memberships', 'groups', 'answers']
    }).$promise;
  }

  /** @ngInject */
  function resolveServices($stateParams, ProjectService) {
    return ProjectService.query({
      projectId: $stateParams.projectId,
      'includes[]': ['product']
    }).$promise;
  }

  /** @ngInject */
  function resolveMemberships($stateParams, Membership) {
    return Membership.query({
      project_id: $stateParams.projectId,
      'includes[]': ['group', 'role']
    }).$promise;
  }

  /** @ngInject */
  function StateController($state, lodash, project, services, memberships) {
    var vm = this;

    vm.title = 'Project Details';
    vm.project = project;
    vm.services = services;
    vm.memberships = memberships;

    vm.activate = activate;
    vm.approve = approve;
    vm.reject = reject;

    activate();

    function activate() {
      //vm.project.group_ids = lodash.pluck(vm.project.groups, 'id');
    }

    function approve() {
      $state.reload();
    }

    function reject() {
      $state.transitionTo('projects.list');
    }
  }
})
();
