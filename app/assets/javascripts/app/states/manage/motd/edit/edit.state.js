(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper, navigationHelper) {
    routerHelper.configureStates(getStates());
    navigationHelper.navItems(navItems());
    navigationHelper.sidebarItems(sidebarItems());
  }

  function getStates() {
    return {
      'manage.motd.edit': {
        url: '/motd/edit',
        templateUrl: 'app/states/manage/motd/edit/edit.html',
        controller: StateController,
        controllerAs: 'vm',
        title: 'Manage Edit MOTD',
        resolve: {
          motd: resolveMotd
        }
      }
    };
  }

  function navItems() {
    return {};
  }

  function sidebarItems() {
    return {};
  }

  /** @ngInject */
  function resolveMotd(Motd) {
    return Motd.get().$promise;
  }

  /** @ngInject */
  function StateController($state, logger, motd, Toasts, lodash, Motd) {
    var vm = this;

    vm.title = 'Edit Message of the Day';
    vm.backToDash = backToDash;
    vm.showValidationMessages = false;
    vm.showErrors = showErrors;
    vm.hasErrors = hasErrors;
    vm.onSubmit = onSubmit;
    vm.activate = activate;
    vm.home = 'dashboard';
    vm.motd = motd;

    activate();

    function activate() {
      logger.info('Activated Edit Message of the Day View');
    }

    function backToDash() {
      $state.go(vm.home);
    }

    function showErrors() {
      return vm.showValidationMessages;
    }

    function hasErrors(field) {
      if (angular.isUndefined(field)) {
        return vm.showValidationMessages && vm.form.$invalid;
      }

      return vm.showValidationMessages && vm.form[field].$invalid;
    }

    function onSubmit() {
      vm.showValidationMessages = true;

      if (vm.form.$valid) {
        if (vm.motd.id) {
          vm.motd.$update(saveSuccess, saveFailure);
        } else {
          vm.motd.$save(saveSuccess, saveFailure);
        }
      }

      function saveSuccess() {
        Toasts.toast('Message of the Day updated.');
        $state.go(vm.home);
      }

      function saveFailure() {
        Toasts.error('Server returned an error while saving.');
      }
    }
  }
})();
