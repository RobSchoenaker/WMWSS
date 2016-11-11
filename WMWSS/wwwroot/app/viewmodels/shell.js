/*global define, ko */
define(['plugins/router', 'durandal/app', 'durandal/system', 'plugins/observable', 'i18next', 'modules/profileModule', 'repositories/accountRepository'],
  function (router, app, system,  observable, i18n, profileModule, accountRepository) {
    "use strict";
    var tt = function (key) {
      var text = i18n.t('app:modules.shell.' + key);
      return text;
    };

    var vm = {
      router: router,
      lastUpdated : null,
      activate: function () {

        router.guardRoute = function (instance, instruction) {
          var url = '/portal#/' + instruction.fragment;
          if (instruction.queryString) {
            url = url + "?" + instruction.queryString;
          }
          if (window.ga) {
            window.ga('send', 'pageview', url);
          }
          return true;
        };

        return profileModule.activate().always(function () {
          vm.profile = profileModule.profile;
          vm.tt = tt;

          router.map([
            { route: ['home', '_=_', ''], title: tt('profile'), moduleId: 'viewmodels/profile', nav: true, category: 'main', icon: 'icon-home' },
            { route: ['advertenties'], title: tt('activeAdvertisements'), moduleId: 'viewmodels/advertisements', nav: true, category: 'advertisement', icon : 'icon-th-thumb' , badge: vm.profile.numberOfActiveAds},
            //{ route: ['zoekopdrachten'], title: tt('searches'), moduleId: 'viewmodels/searches', nav: true, category: 'advertisement', icon: 'icon-star-circled' },
            { route: ['tekeuren'], title: tt('pendingApprovalAds'), moduleId: 'viewmodels/pendingApprovalAds', nav: true, category: 'advertisement', icon: 'icon-hourglass', badge: vm.profile.numberOfToBeConfirmedAds },
            { route: ['archief'], title: tt('archivedAds'), moduleId: 'viewmodels/archivedAds', nav: true, category: 'advertisement', icon: 'icon-folder-close' , badge: vm.profile.numberOfArchivedAds},
            { route: ['wijzigwachtwoord'], title: tt('updatePassword'), moduleId: 'viewmodels/updatePassword', nav: true, category: 'management', icon: 'icon-key' },
            { route: ['beeindigen'], title: tt('terminateRegistration'), moduleId: 'viewmodels/terminateRegistration', nav: true, category: 'management', icon: 'icon-cancel-circled' },
            { route: ['advertisement/:id/conversation/:idCustomer'], title: "xx", moduleId: 'viewmodels/advertisementConversation', nav: false },
          ]).buildNavigationModel();
          setInterval(function () {
            accountRepository.getLastUpdated().then(function (response) {
              if ((!vm.lastUpdated && response.lastUpdated) || vm.lastUpdated < response.lastUpdated) {
                vm.lastUpdated = response.lastUpdated;
                app.trigger('advertisement:statechanged');
              }
            });
          }, 10000);
          return router.activate();
        });
      },
    
      compositionComplete : function () {
        $(".collapse-box").collapse();
      },

      currentTitle: ko.computed(function () {
        var activeRoute = ko.utils.arrayFirst(router.navigationModel(),
          function (item) {
            return item.isActive();
          });

        if (activeRoute) {
          return activeRoute.title;
        }
      })
    };

    vm.managementRoutes = ko.computed(function () {
      return router.navigationModel().filter(function (r) {
        return r.category == 'management'
      });
    });

    vm.mainRoutes = ko.computed(function () {
      return router.navigationModel().filter(function (r) {
        return r.category == 'main'
      });
    });

    vm.advertisementRoutes = ko.computed(function () {
      return router.navigationModel().filter(function (r) {
        return r.nav && r.category === 'advertisement' || (r.category === 'advertisementEdit' && vm.currentCompanyAccessLevel() > 1)
      });
    });

    return vm;
});
