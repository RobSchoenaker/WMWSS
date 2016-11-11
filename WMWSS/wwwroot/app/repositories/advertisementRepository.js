/*global define */
define(['durandal/app', 'durandal/system', 'plugins/http'], function (app, system, http) {

  var names = [];
  var repository = {};

  repository.getActiveAdvertisements = function (page, pageSize) {

    return http.get(app.apiUrl + '/api/portal/advertisements/active', { take: pageSize, skip: (page - 1) * pageSize })
      .then(function (response) {
        return response.advertisements;
      })
      .fail(function (response) {
        system.log("** get active advertisements failed");
      });

  };


  repository.getToBeConfirmedAdvertisements = function (page, pageSize) {

    return http.get(app.apiUrl + '/api/portal/advertisements/tobeconfirmed', { take: pageSize, skip: (page - 1) * pageSize })
      .then(function (response) {
        return response.advertisements;
      })
      .fail(function (response) {
        system.log("** get ToBeConfirmed advertisements failed");
      });

  };

  repository.getArchivedAdvertisements = function (page, pageSize) {

    return http.get(app.apiUrl + '/api/portal/advertisements/archived', { take: pageSize, skip: (page - 1) * pageSize })
      .then(function (response) {
        return response.advertisements;
      })
      .fail(function (response) {
        system.log("** get archived advertisements failed");
      });
  };

  repository.changeState = function (id, idAdvertisementState) {

    return http.post(app.apiUrl + '/api/portal/advertisements/changestate', { id: id, idAdvertisementState: idAdvertisementState })
      .then(function (response) {
        app.trigger('advertisement:statechanged', response.advertisement);
        return response.advertisement;
      })
      .fail(function (response) {
        system.log("** change advertisement state failed");
      });
  };

  repository.getAdvertisementConversation = function (id, idCustomer) {

    return http.get(app.apiUrl + '/api/advertisement/conversation', { idAdvertisement: id, idCustomer: idCustomer })
      .then(function (response) {
        return response.advertisementConversation;
      })
      .fail(function (response) {
        system.log("** get ToBeConfirmed advertisements failed");
      });

  };

  repository.sendMessage = function (id, message, idCustomer) {
    return http.post(app.apiUrl + '/api/advertisement/sendmessage', { idAdvertisement: id, message : message, idCustomer: idCustomer})
      .then(function (response) {
        app.trigger('advertisement:advertisementMessageSent', { idAdvertisement : id});
        return response;
      })
      .fail(function (response) {
        system.log("message sending failed");
      });
  }

  return repository;
});
