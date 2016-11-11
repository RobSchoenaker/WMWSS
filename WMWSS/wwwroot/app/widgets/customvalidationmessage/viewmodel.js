define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    this.settings = {
      valueMessage: null,
      css: '',
      colLabel: 3,
      colText: 9,
    };
    $.extend(this.settings, settings);
    this.cssLabel = ko.observable("col-sm-" + this.settings.colLabel);
    this.cssTextGroup = ko.observable("col-sm-" + this.settings.colText);
  };
  

  return ctor;
});