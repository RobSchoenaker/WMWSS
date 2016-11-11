define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    this.settings = {
      inputName: '',
      labelText: '',
      tt: null, /* translated text function */
      colLabel: 2,
      colInput: 10
    };
    this.settings.inputName = "input-" + settings.fieldName;
    this.settings.labelText = this.settings.fieldName;
    if (settings.tt) {
      this.settings.labelText = settings.tt(settings.fieldName);
    }
    this.settings.checkBoxOptions = {
      value: settings.valueField,
      text: this.settings.labelText,
      //bindingOptions: {
      //  value: this.settings.fieldName,
      //}

    }
    $.extend(this.settings, settings);
    this.cssLabel = ko.observable("col-sm-" + this.settings.colLabel);
    this.cssInputGroup = ko.observable("col-sm-" + this.settings.colInput);
  };
  

  return ctor;
});