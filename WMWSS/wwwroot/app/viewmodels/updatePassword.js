/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'repositories/accountRepository'],
  function (router, app, system,  observable, i18n, accountRepository) {
    "use strict";
    var tt = function (key) {
      var text = i18n.t('app:modules.updatePassword.' + key);
      return text;
    };

    var ttg = function (key) {
      var text = i18n.t('app:modules.global.' + key);
      return text;
    };


    var ctor = function () {
      var _this = this;
      this.activate = function () {
        _this.initializeValidations();
      };
      this.saveCommand = ko.asyncCommand({
        execute: function (callback) {
          var messages = ko.validation.group(_this);
          if (messages().length > 0) {
            app.notify(_this.ttg("checkValidationMessage"), "warning", "Foutmelding");
            messages.showAllMessages();
            callback();
            return;
          }
          accountRepository.updatePassword(_this.newPassword())
            .done(function (content) {
              app.notify(_this.tt('updatedMessage'), 'success');
              _this.newPassword('');
              _this.repeatPassword('');
              ko.validation.group(_this).showAllMessages(false);
              callback();
            })
           .fail(function (content) {
             callback();
           });
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      });

      this.tt = tt;
      this.ttg = ttg;
      this.newPassword = ko.observable();
      this.repeatPassword = ko.observable();
      this.initializeValidations = function () {
        _this.newPassword.extend({ required: { message: _this.tt('newPasswordRequired') } });
        _this.repeatPassword.extend({
          required: { message: _this.tt('repeatPasswordRequired') },
          mustEqual: { message: _this.tt('passwordsMustMatch'), params: _this.newPassword }
        });
      }
    };

    return ctor;
});
