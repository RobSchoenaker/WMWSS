define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    var _this = this;
    this.settings = {
      tt: null,
      min: null,
      max: null,
      valueField: null,
      allowedDates: [],
      calendarOptions : { minZoomLevel: 'month', maxZoomLevel: 'month'}
    };
    $.extend(this.settings, settings);
    if (this.settings.min) {
      this.settings.calendarOptions.min = moment(this.settings.min).toDate();
    }
    if (this.settings.max) {
      this.settings.calendarOptions.max = moment(this.settings.max).toDate();
    }
    if (this.settings.valueField) {
      this.settings.calendarOptions.onValueChanged = function (e) {
        _this.settings.valueField(e.value.toISOString());
      };
    }
    if (this.settings.allowedDates) {
      this.settings.calendarOptions.cellTemplate = function (itemData, itemIndex, itemElement) {
        var settings = ko.contextFor(this._$element[0]).$rawData.settings;
        var dateAllowed = settings.allowedDates.some(function (allowedDate) {
          return moment(allowedDate).diff(moment(itemData.date.toISOString()), 'days') == 0;
        });
        if (!dateAllowed) {
          itemElement.addClass("dx-calendar-empty-cell");
        }

        itemElement.text(itemData.text);

        return itemElement;
      };
    }
  };
  

  return ctor;
});