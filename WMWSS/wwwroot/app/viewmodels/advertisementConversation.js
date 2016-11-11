/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'modules/profileModule', 'repositories/advertisementRepository'],
  function (router, app, system, observable, i18n, profileModule, advertisementRepository) {
    "use strict";

    var ctor = function () {
      var _this = this;

      this.tt = function (key) {
        var text = i18n.t('app:modules.advertisementConversation.' + key);
        return text;
      };

      this.ttg = function (key) {
        var text = i18n.t('app:modules.global.' + key);
        return text;
      };

      this.title = "";
      this.message = ko.observable("");

      this.activate = function (id, idCustomer) {
        var _this = this;
        return advertisementRepository.getAdvertisementConversation(id, idCustomer).then(function (response) {
          system.log("Conversations loaded");
          ko.mapping.fromJS(response, {}, _this);
          _this.title = _this.tt('title').replace("[title]", response.advertisement.title);
          _this.initializeValidations();
          app.on('advertisement:statechanged').then(function () {
            _this.refreshData();
          });
        });

      };

      this.refreshData = function () {
        var _this = this;
        return advertisementRepository.getAdvertisementConversation(_this.advertisement.id(), _this.customer.id()).then(function (response) {
          ko.mapping.fromJS(response, {}, _this);
        });
      }

      this.sendCommand = ko.asyncCommand({
        execute: function (callback) {
          var _this = this;
          var messages = ko.validation.group(_this);
          if (messages().length > 0) {
            //app.notify(_this.ttg("checkValidationMessage"), "warning", "Foutmelding");
            messages.showAllMessages();
            callback();
            return;
          }

          advertisementRepository.sendMessage(_this.advertisement.id(), _this.message(), _this.customer.id())
            .done(function (content) {
              app.notify(_this.tt('messageSentMessage'), 'success');
              setTimeout(function () {
                _this.refreshData().then(function () {
                  _this.message("");
                  messages.showAllMessages(false);
                  callback();
                });
              }, 3000);
            })
           .fail(function (content) {
             callback();
           });
        },
        canExecute: function (isExecuting) {
          return !isExecuting;
        }
      }),


      this.getCss = function (message) {
        var _this = this;
        if (_this.isOwnAdvertisement()) {
          return message.eventCode() == "CustomerToAdvertiser" ? "rgr" : "abr";
        }
        return message.eventCode() == "CustomerToAdvertiser" ? "abr" : "rgr";
      }

      this.initializeValidations = function () {
        var _this = this;
        _this.message.extend({ required: { message: _this.tt('messageRequired') } });
       }
    };

    return ctor;
  });
