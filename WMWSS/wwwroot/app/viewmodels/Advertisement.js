define(['durandal/app', ],
  function (app) {
    var ctor = function (data) {
      var _this = this;

      ko.mapping.fromJS(data, {}, this);

      this.selected = ko.observable(false);

      this.css = ko.computed(function () {
        return _this.selected() ? "active bgm-lightgreen" : "";
      });

      this.createdDisplay = ko.computed(function () {
        return moment(_this.created()).format('LLLL') + " - " + moment(_this.created()).format('LT');
      });


      this.isReserved = ko.computed(function () {
        return _this.idAdvertisementState() == app.advertisementStates.Reserved;
      });

      this.isActive = ko.computed(function () {
        return _this.idAdvertisementState() == app.advertisementStates.Confirmed ||
          _this.idAdvertisementState() == app.advertisementStates.Reserved;
      });

    };
    return ctor;
  });