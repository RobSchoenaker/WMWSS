define([
  'managers/AjaxManager'
], function (ajaxManager) {
  'use strict';

  // our base view controller
  function RegisterViewModel() {
    var _this = this;
    _this.errorMessage = ko.observable(false);
    _this.displayName = ko.observable("");
    _this.firstName = ko.observable("");
    _this.lastName = ko.observable("");
    _this.email = ko.observable("");
    _this.postalCode = ko.observable("");
    _this.houseNumber = ko.observable("");
    _this.houseNumberAddition = ko.observable("");
    _this.phoneNumber = ko.observable("");
    _this.address = ko.observable("");
    _this.showPhoneNumber = ko.observable(false);
    _this.registerCommand = ko.asyncCommand({
      execute: function (callback) {
        _this.errorMessage("");
        if (_this.isValid()) {
          var model = ko.mapping.toJS(_this);
          ajaxManager.postJson('/api/account/register', JSON.stringify(model)).done(function (res) {
            callback();
          }).fail(function (xhr, status, error) {
            if (error == "ArgumentException") {
              _this.errorMessage("<h2>E-mailadres in gebruik</h2><p>Het e-mailadres <strong>" + _this.email() + "</strong> is al in gebruik.</p>"+
                  "<p>Je kunt <strong><a href='/inloggen'>inloggen</a></strong> of een ander e-mailadres opgeven.</p>" +
                  "<p>Als je je wachtwoord niet meer weet, kun je  <strong><a href='/wachtwoord-vergeten'>hier</a></strong> je wachtwoord herstellen.</p>");
            }
            else {
              _this.errorMessage(error);  
            }
            callback();
          });
        } else {
          ko.validation.group(_this).showAllMessages();
          callback();
        }
      },
      canExecute: function (isExecuting) {
        return !isExecuting;
      }
    });

    this.initializeValidations = function () {
      _this.displayName.extend({ required: { message: 'Welke naam kunnen we bij je advertenties tonen?' } });
      _this.firstName.extend({ required: { message: 'Je voornaam is verplicht (wordt niet op de site getoond)' } });
      _this.lastName.extend({ required: { message: 'Je achternaam is verplicht (wordt niet op de site getoond)' } });
      _this.email.extend({ required: { message: 'E-mailadres is verplicht' } });
      _this.email.extend({ email: { message: 'Ongeldig e-mailadres' } });
      _this.postalCode.extend({ required: { message: 'Postcode is verplicht' } });
      _this.postalCode.extend({
        required: { message: 'Postcode, huisnummer en eventuele toevoeging zijn verplicht' },
        validation: {
          async: true,
          onlyIf: function (val) {
            return
          },
          validator: function (val, opts, callback) {
            if (val && _this.houseNumber()) {
              $.ajax({
                dataType: "json",
                url: '/validate/postalcode',
                type: 'POST',
                data: { postalcode: val, houseNumber: _this.houseNumber(), houseNumberAddition: _this.houseNumberAddition() }
              })
              .done(function (response, statusText, xhr) {
                if (response) {
                  _this.postalCode(response.postalCode);
                  _this.address(response.street + ' ' + response.city);
                  callback(true);
                  return;
                }
                else {
                  _this.address('');
                  callback(false);
                }
              })
              .fail(function (xhr, statusText, error) {
                _this.address('');
                _this.errorMessage("Fout bij controleren postcode")
                callback(false);
              });
            }
            else {
              _this.address('');
              callback(true)
            }

          },
          message: 'Ongeldige combinatie van postcode en huisnummer'
        },
      });
      _this.houseNumber.extend({ required: { message: 'Huisnummer is verplicht' } });
      _this.houseNumber.extend({
        required: { message: 'Postcode, huisnummer en eventuele toevoeging zijn verplicht' },
        validation: {
          onlyIf: function (val) {
            return val;
          },
          validator: function (val, opts, callback) {
            return val > 0 && val <= 999999;
          },
          message: 'Huisnummer onjuist'
        },
      });
    };

    _this.isValid = function () {
      var messages = ko.validation.group(this);
      if (messages.length > 0) {
        messages.showAllMessages();
        return false;
      }
      return true;
    };

    this.initializeValidations();
    ko.validation.group(this).showAllMessages(false);

  };

  RegisterViewModel.prototype.constructor = RegisterViewModel;

  return RegisterViewModel;
});