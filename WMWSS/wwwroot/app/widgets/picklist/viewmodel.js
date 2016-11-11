define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    this.settings = {
      idField: 'id',
      textField: 'description',
      items: [],
      inputName: '',
      labelText: '',
      placeHolder: '',
      chosenOptions: { width: '100%'},
      tt: null, /* translated text function */
      colLabel: 2,
      colInput: 10,
      dependsOnField : null,
      dependsOnFieldName : ''
    };

    this.settings.inputName = "input-" + settings.fieldName;
    this.settings.labelText = this.settings.fieldName;
    if (settings.tt) {
      this.settings.labelText = settings.tt(settings.fieldName);
      this.settings.placeHolder = settings.tt(settings.fieldName + "PlaceHolder");
    }
    $.extend(this.settings, settings);
    if (settings.chosenOptions) {
      $.extend(this.settings.chosenOptions, settings.chosenOptions);
    }
    this.cssLabel = ko.observable("col-sm-" + this.settings.colLabel);
    this.cssInputGroup = ko.observable("col-sm-" + this.settings.colInput);

    var _this = this;
    this.selectedItems = ko.computed(function () {
      if (!_this.settings.dependsOnField || !_this.settings.dependsOnFieldName) {
        return _this.settings.items;
      }
      return ko.utils.arrayFilter(_this.settings.items, function (item) {
        return item[_this.settings.dependsOnFieldName] === _this.settings.dependsOnField();
      });
    });
  };

 
  

  return ctor;
});