/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'modules/profileModule', 'repositories/addressRepository', 'repositories/accountRepository'],
  function (router, app, system,  observable, i18n, profileModule, addressRepository, accountRepository) {
    "use strict";
    var tt = function (key) {
      var text = i18n.t('app:modules.profile.' + key);
      return text;
    };

    var ttg = function (key) {
      var text = i18n.t('app:modules.global.' + key);
      return text;
    };


    var vm = {
      router: router,

      postalError: ko.observable(),
      doPostalCheck: function (postalCode, houseNumber) {
        var _this = this;
        addressRepository.getAddress(postalCode, houseNumber)
        .then(function (address) {
          _this.postalError(false);
        }).fail(function (error) {
          _this.postalError(true);
          var messages = ko.validation.group([this.postalCode, this.houseNumber]);
          messages.showAllMessages();
        });
      },


      activate: function () {
        var _this = this;
        return profileModule.activate().always(function () {
          ko.mapping.fromJS(profileModule.profile, {}, vm);

          //Initialize validations
          _this.initializeValidations();

          //Postal code check
          _this.postalCode.subscribe(function (val) {
            var hn = _this.houseNumber();
            if (hn) {
              _this.doPostalCheck(val, hn);
            }
          });
          _this.houseNumber.subscribe(function (val) {
            var pc = _this.postalCode();
            if (pc) {
              _this.doPostalCheck(pc, val);
            }
          });


        });
      },
      saveCommand : ko.asyncCommand({
        execute: function (callback) {
          var _this = this;
          var messages = ko.validation.group(_this);
          if (messages().length > 0) {
            app.notify(_this.ttg("checkValidationMessage"), "warning", "Foutmelding");
            messages.showAllMessages();
            callback();
            return;
          }
          var data = ko.mapping.toJS(_this);
          delete data.postalError;
          accountRepository.updatePersonalData(data)
            .done(function (content) {
              app.notify(_this.tt('profileUpdatedMessage'), 'success');
              callback();
            })
           .fail(function (content) {
             callback();
           });
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      }),
      tt: tt,
      ttg: ttg,
      initializeValidations: function () {
        var _this = this;
        _this.displayName.extend({ required: { message: tt('displayNameRequired') } });
        _this.firstName.extend({ required: { message: tt('firstNameRequired') } });
        _this.lastName.extend({ required: { message: tt('lastNameRequired') } });
        _this.postalCode.extend({
          required: { message: tt('postalCodeRequired') },
        });
        _this.postalError.extend({
          validation: {
            validator: function (val) {
              return !val;
            },
            message: _this.tt("postalCodeHouseNumberWrong")
          }
        })
        _this.houseNumber.extend({
          required: { message: tt('houseNumberRequired') },
          validation: {
            validator: function (val) {
              return val >= 1 && val <= 999999;
            },
            message: _this.tt("houseNumberIncorrect")
          }
        });
      }
    };

    return vm;
});
