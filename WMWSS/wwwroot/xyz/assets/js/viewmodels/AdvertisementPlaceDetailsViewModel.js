define([
  'managers/AjaxManager'
], function (ajaxManager) {
    'use strict';

    // our base view controller
    function AdvertisementPlaceDetailsViewModel(data) {
        var _this = this;
        var mapping = {};


        ko.mapping.fromJS(data, mapping, this);

        _this.idcategory = ko.observable(data.idcategory);
        _this.idaction = ko.observable(data.idaction);
        _this.title = ko.observable(data.title);
        _this.description = ko.observable(data.description);
        _this.price = ko.observable(data.price);
        _this.allow_bids = ko.observable(data.allow_bids);

        _this.saveAdvertisementCommand = ko.asyncCommand({
            execute: function (callback) {
              //_this.description = $("#description").summernote('code');
              if (_this.valid()) {           
                    var model = ko.mapping.toJS(_this);
                    ajaxManager.postJson('/advertentie-plaatsen-details', JSON.stringify(model)).then(function () {
                        callback();
                    }).fail(function (response) {
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
            _this.idcategory.extend({ notEqual: { params: '0', message: 'Kies een categorie' } });
            _this.idaction.extend({ notEqual: { params: '0', message: 'Kies een advertentiesoort' } });
            _this.title.extend({ required: { message: 'Een titel van minimaal 20 karakters is verplicht' } });
            _this.title.extend({ minLength: { params: 10, message: 'Een titel moet minimaal 10 karakters bevatten.' } });
            _this.description.extend({ required: { message: 'Voeg een beschrijving van minimaal 20 karakters toe' } });
            _this.description.extend({ minLength: { params: 20, message: 'Een beschrijving moet minimaal 20 karakters bevatten' } });
        };

        _this.valid = function () {
            var messages = ko.validation.group(this);
            if (messages().length > 0) {
                messages.showAllMessages();
                return false;
            }
            return true;
        };

        this.initializeValidations();
        ko.validation.group(this).showAllMessages(false);
        /* $("#description").summernote(); */
    };

    AdvertisementPlaceDetailsViewModel.prototype.constructor = AdvertisementPlaceDetailsViewModel;

    return AdvertisementPlaceDetailsViewModel;
});