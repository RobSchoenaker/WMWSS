/*global define, require */
define(['durandal/app', 'plugins/observable', 'durandal/system', 'repositories/accountRepository'],
  function (app, observable, system, accountRepository) {
    var module = {
      refresh : function ()
      {
        var _this = this;
        return accountRepository.getProfile().then(function (profile) {
          ko.mapping.fromJS({ profile: profile }, {}, _this);
        });
      },
      activate: function () {
        var _this = this;
        system.log("** activate profileModule");
        app.on('advertisement:statechanged').then(function (advertisement) {
          return _this.refresh();
        });
        return _this.refresh();
      },

    };

    return module;
  });
