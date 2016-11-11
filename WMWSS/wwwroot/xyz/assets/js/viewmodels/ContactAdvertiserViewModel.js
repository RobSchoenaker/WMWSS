define([
  'managers/AjaxManager'
], function (ajaxManager) {
    'use strict';

    // our base view controller
    function ContactAdvertiserViewModel(data) {
        var _this = this;
        _this.IdAdvertisement = ko.observable(data.IdAdvertisement);
        _this.displayName = ko.observable(data.displayName);
        _this.messageValid = ko.observable(false);
        _this.messageText = ko.observable('');
        _this.messageText.subscribe(function (newValue) {
            _this.messageValid(newValue.length >= 30);
        });
        _this.messageKeyPress = function (d, e) {
            if (e.keyCode === 13) {
                _this.doSendMessage(function () { });
                return false;
            }
            return true;
        };
        _this.notifySuccess = function (message) {
            $.bootstrapGrowl(message, {
                ele: 'body',
                type: 'success',
                offset: { from: 'top', amount: 20 },
                align: 'center',
                width: 'auto',
                delay: 4000,
                allow_dismiss: true,
                stackup_spacing: 10
            });
        }

        _this.notifyError = function (message) {
            $.bootstrapGrowl(message, {
                ele: 'body',
                type: 'danger',
                offset: { from: 'top', amount: 20 },
                align: 'center',
                width: 'auto',
                delay: 4000,
                allow_dismiss: true,
                stackup_spacing: 10
            });
        }
        _this.doSendMessage = function (callback) {
            var model = {
                IdAdvertisement: _this.IdAdvertisement(),
                message: _this.messageText()
            };
            ajaxManager.postJson('/api/advertisement/sendmessage', JSON.stringify(model)).done(function (res) {
                if (!res.responseStatus) {
                    // Show toast
                    $('#contactAdvertiser').modal("hide");
                    _this.notifySuccess('<i class="fa fa-check-square-o ln-shadow"></i> Bericht aan ' + _this.displayName() + ' verstuurd');
                }
                callback();
            }).fail(function (xhr, status, error) {
                _this.notifyError('<i class="fa fa-exclamation  ln-shadow"></i> Fout bij versturen bericht aan ' + _this.displayName());
                callback();
            });
        }

        _this.sendMessageCommand = ko.asyncCommand({
            execute: function (callback) {
                if (_this.valid()) {
                    _this.doSendMessage(callback);                   
                } else {                    
                    callback();
                }
            },
            canExecute: function (isExecuting) {
                return !isExecuting;
            }
        });

        _this.valid = function () {
            return _this.messageValid();
        };

        $('#contactAdvertiser').on('shown.bs.modal', function () {
            ga('send', 'pageview', 'contactAdvertiser/' + _this.IdAdvertisement());
        });


    };

    ContactAdvertiserViewModel.prototype.constructor = ContactAdvertiserViewModel;

    return ContactAdvertiserViewModel;
});