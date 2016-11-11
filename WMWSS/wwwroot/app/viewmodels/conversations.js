/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'modules/profileModule', 'repositories/accountRepository'],
  function (router, app, system, observable, i18n, profileModule, accountRepository) {
    "use strict";
    var tt = function (key) {
      var text = i18n.t('app:modules.conversations.' + key);
      return text;
    };

    var ttg = function (key) {
      var text = i18n.t('app:modules.global.' + key);
      return text;
    };

    var vm = {
      router: router,
      activate: function () {
        var _this = this;
        app.on('advertisement:statechanged').then(function () {
          _this.refreshData();
        });
        return accountRepository.getConversations().then(function (response) {
          system.log("Conversations loaded");
          ko.mapping.fromJS(response, {}, vm);
        });

      },
      tt: tt,
      ttg: ttg,
      getLink: function (conversation) {
        return "#/advertisement/" + conversation.advertisement.id() + "/conversation/" + conversation.idCustomerMessages();
      },
      refreshData: function () {
        system.log("Refreshing conversations");
        return accountRepository.getConversations().then(function (response) {
          system.log("Conversations loaded again");
          ko.mapping.fromJS(response, {}, vm);
        });

      }
    };

    return vm;
  });
