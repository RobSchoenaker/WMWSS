/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next',
  'repositories/advertisementRepository', 'repositories/refCodesRepository', 'viewmodels/advertisement'],
  function (router, app, system, observable, i18n, advertisementRepository, refCodesRepository, Advertisement) {
    "use strict";

    var ctor = function () {
      var _this = this;
      this.ttg = function (key) {
        var text = i18n.t('app:modules.global.' + key);
        return text;
      };


      this.tt = function (key) {
        var text = i18n.t('app:modules.advertisements.' + key);
        return text;
      };

      this.getStateDescription = function (advertisement) {
        var description = "";
        ko.utils.arrayForEach(_this.advertisementStates, function (state) {
          if (advertisement.idAdvertisementState === state.id) {
            description = state.description;
            return;
          }
        });
        return description;
      }

      this.markAsSuccess = function (advertisement) {
        app.startAfterConfirmation(function () {
          return advertisementRepository.changeState(advertisement.id(), app.advertisementStates.Success);
        },
        {
          title: _this.tt('markAsSuccess'),
          content: _this.tt('markAsSuccessQuestion').replace("[title]", advertisement.title()),
          successMessage: _this.tt('markAsSuccessSuccessMessage'),
          callback: function (response) {
            router.activeItem().activate();
          },
        });
      };

      this.withdraw = function (advertisement) {
        app.startAfterConfirmation(function () {
          return advertisementRepository.changeState(advertisement.id(), app.advertisementStates.Deleted);
        },
       {
         title: _this.tt('withdraw'),
          content: _this.tt('withdrawQuestion').replace("[title]", advertisement.title()),
          successMessage: _this.tt('withdrawSuccessMessage'),
          callback: function (response) {
            router.activeItem().activate();
          },
        });
      };

      this.markAsReserved = function (advertisement) {
        app.startAfterConfirmation(function () {
          return advertisementRepository.changeState(advertisement.id(), app.advertisementStates.Reserved);
        },
        {
          title: _this.tt('markAsReserved'),
          content: _this.tt('markAsReservedQuestion').replace("[title]", advertisement.title()),
          successMessage: _this.tt('markAsReservedSuccessMessage'),
          callback: function (response) { advertisement.idAdvertisementState(app.advertisementStates.Reserved) },
        });
      };

      this.cancelReservation = function (advertisement) {
        app.startAfterConfirmation(function () {
          return advertisementRepository.changeState(advertisement.id(), app.advertisementStates.Confirmed);
        },
        {
          title: _this.tt('cancelReservation'),
          content: _this.tt('cancelReservationQuestion').replace("[title]", advertisement.title()),
          successMessage: _this.tt('cancelReservationSuccessMessage'),
          callback: function (response) { advertisement.idAdvertisementState(app.advertisementStates.Confirmed); },
        });
      };

      this.activate = function (params) {
        var _this = this;
        var page = 1;
        if (params && params.page && params.page > 0) {
          page = params.page;
        }
        return $.when(advertisementRepository.getActiveAdvertisements(page, 5), refCodesRepository.getAdvertisementStates())
         .then(function (data, advertisementStates) {
           _this.page = ko.observable(page);
           _this.advertisementStates = advertisementStates;

           var mapping = {
             'advertisements': {
               create: function (options) {
                 return new Advertisement(options.data);
               }
             }
           };
           ko.mapping.fromJS({ advertisements: data.items, totalCount: data.totalCount }, mapping, _this);

           _this.activeAdvertisements = ko.computed(function () {
             return ko.utils.arrayFilter(_this.advertisements(), function (advertisement) {
               return advertisement.isActive();
             });
           });
         });
      };
    };

    return ctor;
  });
