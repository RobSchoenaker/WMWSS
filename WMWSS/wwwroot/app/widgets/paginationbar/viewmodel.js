define(['durandal/composition', 'jquery'], function (composition, $) {
  var ctor = function () { };

  ctor.prototype.activate = function (settings) {
    this.settings = {
      totalCount: 0,
      page: 1,
      pageSize: 5,
      maxPageNumbersOnPage: 5,
      url: '',
      nextText: "Volgende »",
      previousText: "« Vorige",
    };
    $.extend(this.settings, settings);
    this.settings.page = parseInt(this.settings.page);
    this.settings.totalCount = parseInt(this.settings.totalCount);

    var pageNums = [];
    maxPages = Math.floor(this.settings.totalCount / this.settings.pageSize);
    if (this.settings.totalCount / this.settings.pageSize > maxPages) {
      maxPages = maxPages + 1;
    }

    var minPage = 1;
    var maxPage = maxPages;
    if (maxPages > this.settings.maxPageNumbersOnPage) {
      minPage = this.settings.page;
      maxPage = this.settings.page + this.settings.maxPageNumbersOnPage - 1;
      if (maxPages < maxPage) {
        maxPage = maxPages;
      }
    }

    for (var i = minPage; i <= maxPage; i++) {
      pageNums.push(i);
    }

    this.pages = ko.observableArray(pageNums);

    this.getUrl = function (page) {
      return this.settings.url+ "?page=" + page
    };

    this.nextPage = ko.observable(this.settings.page + 1);
    this.previousPage = ko.observable(this.settings.page - 1);
    this.nextVisible = ko.observable(this.settings.page < maxPages);
    this.previousVisible = ko.observable(this.settings.page > 1);
    this.showPager = ko.observable(maxPage > 1);
    this.totalCount = ko.observable(this.settings.totalCount);
  };
  

  return ctor;
});