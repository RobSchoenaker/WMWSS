/*global define */
define(['durandal/app', 'durandal/system', 'plugins/http'], function(app, system, http) {

  var names = [];
  var repository = {};

  repository.getProfile = function() {

    return http.get(app.apiUrl + '/api/account/profile')
      .then(function(response) {
        return response.profile;
      })
      .fail(function(response) {
        system.log("** get profile failed");
      });

  };

  repository.updatePassword = function (newPassword) {
    return http.post(app.apiUrl + '/api/account/updatePassword', {
       newPassword: newPassword
    });
  }

  repository.updatePersonalData = function (account) {
    return http.post(app.apiUrl + '/api/account/update', account);
  }

  repository.getConversations = function (newPassword) {
    return http.get(app.apiUrl + '/api/account/conversations', {
    });
  }


  repository.getLastUpdated = function () {
    return http.get(app.apiUrl + 'api/account/lastupdate', {
    });
  }

  repository.terminateAccount = function () {
    return http.post(app.apiUrl + 'api/account/terminate', {
    });
  }
  return repository;
});
