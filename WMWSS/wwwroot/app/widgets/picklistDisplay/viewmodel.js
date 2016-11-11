define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    this.settings = {
      idField: 'id',
      textField: 'description',
      items: [],
    };

    $.extend(this.settings, settings);

    var displayText = "";
    var _this = this;
    ko.utils.arrayForEach(_this.settings.items, function (item) {
      if (item[_this.settings.idField] == _this.settings.valueField()) {
        displayText = item[_this.settings.textField];
        return;
      }
    });
    this.displayText = ko.observable(displayText);
  };

  return ctor;
});