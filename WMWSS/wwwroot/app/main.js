/*global window, requirejs, define, jQuery, $, ko , ludu*/
requirejs.config({
  paths: {
    'text': '../assets/js/requirejs/text',
    'durandal': '../assets/js/durandal',
    'plugins': '../assets/js/durandal/plugins',
    'transitions': '../assets/js/durandal/transitions',
    'i18next': '../assets/js/i18next/i18next.amd.withJQuery.min'
  },
  urlArgs: "bust=" + ludu.settings.version,
});

define('jquery', [], function () {
  "use strict";
  return jQuery;
});

define('knockout', ko);

define('izzi/deleteManager', ['managers/DeleteManager'], function (DeleteManager) {
  return new DeleteManager();
});


define(['durandal/system', 'durandal/app', 'durandal/viewLocator', 'durandal/binder', 'i18next', 'plugins/widget'],
  function (system, app, viewLocator, binder, i18n, widget) {
    "use strict";
    //>>excludeStart("build", true);
    system.debug(true);
    //>>excludeEnd("build");
    var i18NOptions = {
      detectFromHeaders: false,
      lng: ludu.settings.currentCulture,
      fallbackLang: 'nl',
      ns: 'app',
      resGetPath: '/app/locales/__lng__/__ns__.json',
      useCookie: false
    };

    app.title = 'Gratis af te halen';

    app.configurePlugins({
      router: true,
      dialog: true,
      observable: true,
      widget: true,
    });

    widget.registerKind('textinput');
    widget.registerKind('customvalidationmessage');
    widget.registerKind('picklist');
    widget.registerKind('checkinput');
    widget.registerKind('dateinput');
    widget.registerKind('timeinput');
    widget.registerKind('calendarinput');
    widget.registerKind('colorpicker');
    widget.registerKind('textareainput');
    widget.registerKind('picklistDisplay');
    widget.registerKind('paginationbar');

    ko.validation.init({
      messagesOnModified: true,
      insertMessages: true,
      decorateElement: true,
      errorElementClass: 'has-error',
      errorMessageClass: 'help-block'
    }, true);
    ko.validation.rules['mustEqual'] = {
      validator: function (val, otherVal) {
        return val === otherVal();
      }
    };
    ko.validation.registerExtenders();

    app.notify = function notify(message, type, title) {
      $.bootstrapGrowl(message, {
        ele: 'body', // which element to append to
        type: type, // (null, 'info', 'error', 'success')
        offset: { from: 'top', amount: 20 }, // 'top', or 'bottom'
        align: 'center', // ('left', 'right', or 'center')
        width: 300, // (integer, or 'auto')
        delay: type === "danger" ? 100000 : 4000,
        allow_dismiss: true,
        stackup_spacing: 10 // spacing between consecutively stacked growls.
      });
    }

    app.startAfterConfirmation = function (action, settings) {
      var _this = this;
      this.settings = {
        title: '',
        content: '',
        yesText: 'Ja',
        noText: 'Nee',
        successMessage: '',
        showLoadingPanel: function () { },
        hideLoadingPanel: function () { },
        callback: function (response) { },
        messageType: 'warning'
      };

      if (settings) {
        $.extend(this.settings, settings);
      }
      return swal({
        title: _this.settings.title,
        text: _this.settings.content,
        type: _this.settings.messageType,
        showCancelButton: true,
        cancelButtonText: _this.settings.noText,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: _this.settings.yesText,
        closeOnConfirm: true,
        animation: false
      }, function () {
        _this.settings.showLoadingPanel();
        $.when(action()).done(function (response) {
          _this.settings.hideLoadingPanel();
          if (_this.settings.successMessage) {
            app.notify(_this.settings.successMessage, "success");
          }
          _this.settings.callback(response);
        }).fail(function (response) {
          _this.settings.hideLoadingPanel();
        });
      });
    }



    app.handleResponseError = function (response) {
      system.log(JSON.stringify(response));
      if (response.responseJSON && response.responseJSON.responseStatus) {
        app.notify("Er is iets fout gegaan: " + response.responseJSON.responseStatus.message, "danger");
      }
      else {
        app.notify("Er is iets foutgegaan, probeer het opnieuw", "danger");
      }
    }

    app.initForm = function () {

    }

    app.start().then(function () {
      //Replace 'viewmodels' in the moduleId with 'views' to locate the view.
      //Look for partial views in a 'views' folder in the root.
      viewLocator.useConvention();

      //Show the app by setting the root view model for our application with a transition.

      i18n.init(i18NOptions, function () {
        //Call localization on view before binding...
        binder.binding = function (obj, view) {
          $(view).i18n();
        };
        //Show the app by setting the root view model for our application with a transition.
        app.setRoot(ludu.settings.entrance, 'entrance');
      });
      app.apiUrl = ludu.settings.apiUrl;

      app.advertisementStates = {
        ToBeConfirmed : 1,
        Confirmed : 2,
        Rejected  : 3,
        Expired : 4,
        Success : 5,
        Deleted : 6,
        Reserved : 7
      };


      $.ajaxSetup({
        dataType: "json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: false
      });
    });
  });

(function () {
  "use strict";
  var toMoney = function (num) {
    return '€ ' + (num.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'));
  };

  ko.bindingHandlers.money = {
    update: function (element, valueAccessor, allBindings) {
      var $el = $(element),
        method,
        valueUnwrapped = ko.unwrap(valueAccessor());

      if ($el.is(':input')) {
        method = 'val';
      } else {
        method = 'text';
      }
      return $el[method](toMoney(valueUnwrapped));
    }
  };

  ko.bindingHandlers.date = {
    update: function (element, valueAccessor, allBindings) {
      var $el = $(element),
        method,
        valueUnwrapped = ko.unwrap(valueAccessor());

      if ($el.is(':input')) {
        method = 'val';
      } else {
        method = 'text';
      }
      if (valueUnwrapped) {
        return $el[method](moment(valueUnwrapped).format('LL'));
      }
      else {
        return $el[method]("");
      }
    }
  };

  ko.bindingHandlers.datetime = {
    update: function (element, valueAccessor, allBindings) {
      var $el = $(element),
        method,
        valueUnwrapped = ko.unwrap(valueAccessor());

      if ($el.is(':input')) {
        method = 'val';
      } else {
        method = 'text';
      }
      if (valueUnwrapped) {
        return $el[method](moment(valueUnwrapped).format('LLLL'));
      }
      else {
        return $el[method]("");
      }
    }
  };

  ko.bindingHandlers.time = {
    update: function (element, valueAccessor, allBindings) {
      var $el = $(element),
        method,
        valueUnwrapped = ko.unwrap(valueAccessor());

      if ($el.is(':input')) {
        method = 'val';
      } else {
        method = 'text';
      }
      if (valueUnwrapped) {
        return $el[method](moment(valueUnwrapped).format('LT'));
      }
      else {
        return $el[method]("");
      }
    }
  };

  ko.bindingHandlers.dateTimePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
      //initialize datepicker with some optional options
      var options = allBindingsAccessor().dateTimePickerOptions || {};
      $(element).datetimepicker(options);

      //when a user changes the date, update the view model
      ko.utils.registerEventHandler(element, "dp.change", function (event) {
        var value = valueAccessor();
        if (ko.isObservable(value)) {
          if (event.date != null && !(event.date instanceof Date)) {
            value(event.date.toDate());
          } else {
            value(event.date);
          }
        }
      });

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        var picker = $(element).data("DateTimePicker");
        if (picker) {
          picker.destroy();
        }
      });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

      var picker = $(element).data("DateTimePicker");
      //when the view model is updated, update the widget
      if (picker) {
        var koDate = ko.utils.unwrapObservable(valueAccessor());

        //in case return from server datetime i am get in this form for example /Date(93989393)/ then fomat this
        koDate = (typeof (koDate) !== 'object') ? moment(koDate) : koDate;

        picker.date(koDate);
      }
    }
  };

  ko.bindingHandlers.chosen = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element = $(element);
      var options = ko.unwrap(valueAccessor());

      if (typeof options === 'object')
        $element.chosen(options);
      else
        $element.chosen();

      ['options', 'selectedOptions', 'value'].forEach(function (propName) {
        if (allBindings.has(propName)) {
          var prop = allBindings.get(propName);
          if (ko.isObservable(prop)) {
            prop.subscribe(function () {
              $element.trigger('chosen:updated');
            });
          }
        }
      });
    }
  }
}());
