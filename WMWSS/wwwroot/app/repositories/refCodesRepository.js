/*global define*/
define(['durandal/app', 'durandal/system', 'plugins/http', 'i18next'], function (app, system, http, i18n) {

  var repository = {};
  var genders = [];
  var advertisementStates = [];
  

  repository.getGenders = function () {

    if (genders.length == 0) {
      genders.push({code : 'M' , description : i18n.t('app:modules.global.' + 'male')});
      genders.push({code : 'F' , description : i18n.t('app:modules.global.' + 'female')});
    }
    var result = $.Deferred();
    result.resolve(genders);
    return result.promise();
  };

  repository.getAdvertisementStates = function () {
    if (advertisementStates.length == 0) {
      advertisementStates.push({ id: 1, description: i18n.t('app:modules.advertisementState.toBeConfirmed') });
      advertisementStates.push({ id: 2, description: i18n.t('app:modules.advertisementState.confirmed') });
      advertisementStates.push({ id: 3, description: i18n.t('app:modules.advertisementState.rejected') });
      advertisementStates.push({ id: 4, description: i18n.t('app:modules.advertisementState.expired') });
      advertisementStates.push({ id: 5, description: i18n.t('app:modules.advertisementState.success') });
      advertisementStates.push({ id: 6, description: i18n.t('app:modules.advertisementState.deleted') });
      advertisementStates.push({ id: 7, description: i18n.t('app:modules.advertisementState.reserved') });
    }
    var result = $.Deferred();
    result.resolve(advertisementStates);
    return result.promise();
  };


  return repository;
});
