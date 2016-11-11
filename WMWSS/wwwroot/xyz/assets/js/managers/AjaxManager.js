define([], function () {
  "use strict";

  var AjaxManager = function () {
    var _this = this;


    _this.get = function (url, data) {
      var url = _this.getUrl(url);
      return $.ajax({
        type: 'GET',
        url: url,
        data: data,
        dataType: 'json',
        success: function (msg, status) {
          _this.successfn(msg, status);
        },
        error: function (msg, status) {
          _this.errorfn(msg, status);
        }
      });
    }

    _this.post = function (url, data) {
      var url = _this.getUrl(url);
      return $.ajax({
        type: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        success: function (msg, status) {
          _this.successfn(msg, status);
        },
        error: function (msg, status) {
          _this.errorfn(msg, status);
        }
      });
    }

    _this.postJson = function (url, data) {
      var url = _this.getUrl(url);
      var token = $('input[name="__RequestVerificationToken"]').val();
      var headers = {};
      headers['__RequestVerificationToken'] = token;

      return $.ajax({
        type: 'POST',
        url: url,
        contentType: "application/json; charset=utf-8",
        data: data,
        headers: headers,
        dataType: 'json',
        success: function (msg, status) {
          _this.successfn(msg, status);
        },
        error: function (msg, status) {
          _this.errorfn(msg, status);
        }
      });
    }

    _this.getUrl = function (input) {
      return input;
    }

    _this.errorfn = function (msg, status) {

      if (msg.redirect) {
        window.location.href = msg.redirect;
      }
    }

    _this.successfn = function (msg, status) {

      if (msg.redirect) {
        window.location.href = msg.redirect;
      }
    }
  };

  return new AjaxManager();

});