define([
  'managers/AjaxManager'
], function (ajaxManager) {
    'use strict';

    // our base view controller
    function ForgotPasswordViewModel(data) {
        var _this = this;
        var mapping = {};


        ko.mapping.fromJS(data, mapping, this);

        _this.email = ko.observable();
        _this.sentSuccessful = ko.observable(false);
        _this.sendFailed = ko.observable(false);
        _this.sendFailedMessage = ko.observable("");

        this.initializeValidations = function () {
            _this.email.extend({ required: { message: 'E-mailadres is verplicht' } });
            _this.email.extend({ email: { message: 'Ongeldig e-mailadres' } });
        };

        _this.isValid = function () {
            var messages = ko.validation.group(this);
            if (messages.length > 0) {
                messages.showAllMessages();
                return false;
            }
            return true;
        };

        _this.sendCommand = ko.asyncCommand({
          execute: function (callback) {
            var messages = ko.validation.group(_this);
            if (messages().length > 0) {
              messages.showAllMessages();
              callback();
              return;
            }
            $.post("/api/account/forgotpassword", { email: _this.email() })
              .done(function (content) {
                _this.sentSuccessful(true);
                _this.sendFailed(false);
                callback();
              })
             .fail(function (content,status,error) {
               if (content.status == 406) {
                 _this.sendFailedMessage("Het ingevulde e-mailadres is niet gevonden.");
               } else {
                 _this.sendFailedMessage("Er is iets misgegaan. Probeer het opnieuw.");
               }
               _this.sendFailed(true);
               callback();
             });
          },
          canExecute: function (isExecuting) {
            return !isExecuting;
          }
        });

        this.initializeValidations();

    };

    ForgotPasswordViewModel.prototype.constructor = ForgotPasswordViewModel;

    return ForgotPasswordViewModel;
});