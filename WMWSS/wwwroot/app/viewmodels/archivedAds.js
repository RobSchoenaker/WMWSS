/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'repositories/advertisementRepository', 'repositories/refCodesRepository'],
  function (router, app, system, observable, i18n, advertisementRepository, refCodesRepository) {
    "use strict";

    var ctor = function () {
      var _this = this;
      this.ttg = function (key) {
        var text = i18n.t('app:modules.global.' + key);
        return text;
      };

      this.tt = function (key) {
        var text = i18n.t('app:modules.archivedAds.' + key);
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


      this.activate = function (params) {
        var _this = this;
        var page = 1;
        if (params && params.page && params.page > 0) {
          page = params.page;
        }
        return $.when(advertisementRepository.getArchivedAdvertisements(page, 5), refCodesRepository.getAdvertisementStates())
         .then(function (advertisements, advertisementStates) {
           _this.advertisements = ko.observableArray(advertisements.items);
           _this.totalCount = ko.observable(advertisements.totalCount);
           _this.page = ko.observable(page);
           _this.advertisementStates = advertisementStates;
         })
      };
    };

    return ctor;
});
