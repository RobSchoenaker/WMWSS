/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'repositories/accountRepository'],
  function (router, app, system,  observable, i18n, accountRepository) {
    "use strict";

    var ctor = function () {
      var _this = this;
      _this.shouldTerminate = ko.observable(false);
      this.ttg = function (key) {
        var text = i18n.t('app:modules.global.' + key);
        return text;
      };

      this.tt = function (key) {
        var text = i18n.t('app:modules.terminateRegistration.' + key);
        return text;
      };

      this.activate = function (params) {
        var _this = this;

      };


      this.terminateCommand = ko.asyncCommand({
        execute: function (callback) {
          
          accountRepository.terminateAccount()
            .done(function (content) {
              window.location.href = content.redirect;
            })
           .fail(function (content) {
             callback();
           });
        },
        canExecute: function (isExecuting) {
          return !isExecuting && _this.shouldTerminate();
        }
      });
    };

    return ctor;
});
