define('colorViewModel', [], function () {
  var ctor = function (data, isActive) {
    this.id = ko.observable(data.id),
    this.className = ko.observable(data.className);
    this.isActive = ko.observable(isActive);
    var _this = this;
    this.itemClass = ko.computed(function () {
      if (_this.isActive()) {
        return _this.className() + " active";
      }
      return _this.className();
    });
  };

  return ctor;
});

define(['durandal/composition', 'colorViewModel'], function (composition, ColorViewModel) {
  var ctor = function () {
    
  };

  ctor.prototype.activate = function (settings) {
    var _this = this;
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


    _this.colors = ko.observableArray([]);
    ko.utils.arrayForEach(_this.settings.items, function (color) {
      _this.colors.push(new ColorViewModel(color, color.id == _this.settings.valueField()));
    });

    this.selectColor = function (color) {
      _this.settings.valueField(color.id);
      ko.utils.arrayForEach(_this.colors(), function (item) {
        item.isActive(color.id() == item.id())
      });
    };
  };
  



  return ctor;
});