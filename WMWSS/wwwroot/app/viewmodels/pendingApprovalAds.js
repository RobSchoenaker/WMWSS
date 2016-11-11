/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'repositories/advertisementRepository', 'viewmodels/advertisement'],
  function (router, app, system, observable, i18n, advertisementRepository, Advertisement) {
    "use strict";

    var ctor = function () {
      var _this = this;
      this.ttg = function (key) {
        var text = i18n.t('app:modules.global.' + key);
        return text;
      };

      this.tt = function (key) {
        var text = i18n.t('app:modules.pendingApprovalAds.' + key);
        return text;
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

      this.activate = function (params) {
        var _this = this;
        var page = 1;
        if (params && params.page && params.page > 0) {
          page = params.page;
        }
        return $.when(advertisementRepository.getToBeConfirmedAdvertisements(page, 5))
         .then(function (data) {
           var mapping = {
             'advertisements': {
               create: function (options) {
                 return new Advertisement(options.data);
               }
             }
           };
           ko.mapping.fromJS({ advertisements: data.items, totalCount: data.totalCount }, mapping, _this);
           _this.page = ko.observable(page);
         })
      };


    };

    return ctor;
});
