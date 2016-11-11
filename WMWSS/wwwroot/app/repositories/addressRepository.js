/*global define */
define(['durandal/app', 'durandal/system', 'plugins/http'], function (app, system, http) {

  var names = [];
  var repository = {};

  repository.getAddress = function (postalCode,houseNumber) {

    return http.get(app.apiUrl + '/api/address',
      {
        postalCode: postalCode,
        houseNumber: houseNumber
      }
     )
      .then(function (response) {
        return response.address;
      })

  };

  return repository;
});
