(function() {
  'use strict';

  angular.module('app.components')
    .config(projectForm);

  /** @ngInject */
  function projectForm(FormsProvider) {
    FormsProvider.register('projectForm', {
      fields: [
        {
          className: 'forms__body',
          fieldGroup: [
            {
              key: 'name',
              type: 'text',
              templateOptions: {
                label: 'Name',
                required: true
              },
              validation: {
                messages: {
                  required: '"A project name must be provided"'
                }
              }
            },
            {
              key: 'description',
              type: 'textarea',
              templateOptions: {
                label: 'Description'
              }
            },
            {
              key: 'budget',
              type: 'price',
              templateOptions: {
                label: 'Budget',
                required: true,
                precision: 12,
                scale: 2
              },
              validation: {
                messages: {
                  required: '"A budget must be provided"'
                }
              }
            },
            {
              key: 'start_date',
              type: 'date',
              templateOptions: {
                label: 'Start Date',
                required: true
              },
              validation: {
                messages: {
                  required: '"A start date must be provided"'
                }
              }
            },
            {
              key: 'end_date',
              type: 'date',
              templateOptions: {
                label: 'End Date',
                required: true
              },
              validation: {
                messages: {
                  required: '"An end date must be provided"'
                }
              }
            },
            {
              key: 'answers',
              type: 'questions'
            }
          ]
        },
        {
          className: 'forms__aside',
          fieldGroup: [
            {
              key: 'img',
              type: 'image-chooser'
            }
          ]
        }
      ]
    });
  }
})();
