define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    this.settings = {
      inputName: '',
      labelText: '',
      placeHolder: '',
      inputType: 'text',
      dateTimePickerOptions : {
        locale: 'nl',
        format: 'L',
        useCurrent : false,
      },
      css: '',
      tt: null, /* translated text function */
      colLabel: 2,
      colInput: 10,
    };
    this.settings.inputName = "input-" + settings.fieldName;
    this.settings.labelText = this.settings.fieldName;
    if (settings.tt) {
      this.settings.labelText = settings.tt(settings.fieldName);
      this.settings.placeHolder = settings.tt(settings.fieldName + "PlaceHolder");
    }
    $.extend(this.settings, settings);
    this.cssLabel = ko.observable("col-sm-" + this.settings.colLabel);
    this.cssInputGroup = ko.observable("col-sm-" + this.settings.colInput);
  };
  

  return ctor;
});