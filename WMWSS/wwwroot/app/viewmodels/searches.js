/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next'],
  function (router, app, system,  observable, i18n) {
    "use strict";

    var ctor = function () {
      var _this = this;
      this.ttg = function (key) {
        var text = i18n.t('app:modules.global.' + key);
        return text;
      };

      this.tt = function (key) {
        var text = i18n.t('app:modules.seaches.' + key);
        return text;
      };

      this.activate = function (params) {
        var _this = this;
        //return $.when(roleRepository.getById(params))
        // .then(function (role) {
        //   ko.mapping.fromJS(role, {}, _this);
        //   _this.initializeValidations();
        //   var activeInstruction = router.activeInstruction();
        //   if (activeInstruction.queryParams) {
        //     _this.returnUrl = activeInstruction.queryParams["returnUrl"];
        //   }
        //   else {
        //     _this.returnUrl = "/#roles?restoreState=true";
        //   }
        //   activeInstruction.config.title = role.description;
        // });
      };
    };

    return ctor;
});
