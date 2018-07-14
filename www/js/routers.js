angular.module('starter')
.config(function($stateProvider,$urlRouterProvider,$ionicConfigProvider,toastrConfig) {

  angular.extend(toastrConfig, 
  {
    autoDismiss: true,
    containerId: 'toast-container',
    maxOpened: 1,    
    newestOnTop: true,
    positionClass: 'toast-bottom-center',
    preventDuplicates: false,
    preventOpenDuplicates: false,
    target: 'body',
    progressBar: true,
    closeButton: false,
    timeOut: 3000,
  });

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider.state('auth', 
  {
      url: '/auth',
      templateUrl: 'templates/auth/mainlogin.html',
      abstract:true,
  });
  $stateProvider.state('auth.login', 
  {
      url: '/login',
      views: 
      {
          'login-tab': 
          {
            templateUrl: 'templates/auth/login.html',
            controller:'LoginCtrl'
          }
      },
      resolve:
      {
          userinformation: function ($q,StorageService,$injector,$location) 
          {
              var userinformation = StorageService.get('advanced-profile');
              if(userinformation)
              {
                  $location.path("/tab/ppob");
                  $apply();
              }
          }
      }
  });
  $stateProvider.state('auth.registrasi', 
  {
      url: '/registrasi',
      views: 
      {
          'registrasi-tab': 
          {
            templateUrl: 'templates/auth/registrasi.html',
            controller:'RegistrasiCtrl'
          }
      }
  });

  $stateProvider
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  .state('tab.lowongankerja', {
    url: '/lowongankerja',
    views: {
      'tab-lowongan': {
        templateUrl: 'templates/lowongankerja/index.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('tab.lowongankerja-detail', 
  {
      url: '/lowongankerja/:detail',
      views: 
      {
        'tab-lowongan': 
        {
          templateUrl: function($stateParams)
          {
            if($stateParams.detail == 'filter')
            {
              return 'templates/lowongankerja/filter.html' ; 
            }
            else if($stateParams.detail == 'tokenpln')
            {
              return 'templates/ppob/formtokenpln.html'; 
            }
            else if($stateParams.detail == 'tagihanpln')
            {
              return 'templates/ppob/formtagihanpln.html'; 
            }
            else if($stateParams.detail == 'tagihanpdam')
            {
              return 'templates/ppob/formtagihanpdam.html'; 
            }
            
          },
          controller: 'FilteringCtrl'
        }
      }
  })
  .state('tab.lowongankerja-melamar', 
  {
      url: '/melamar',
      views: 
      {
        'tab-lowongan': 
        {
          templateUrl:'templates/lowongankerja/melamar.html',
          controller:'MelamarCtrl'
        }
      }
  })
  .state('tab.lowongandisimpan', 
  {
      url: '/lowongandisimpan',
      views: {
        'tab-lowongandisimpan': {
          templateUrl: 'templates/lowongankerja/lowongandisimpan.html',
          controller: 'DashCtrl'
        }
      }
  })
  .state('tab.lowongandisimpan-melamar', 
  {
      url: '/lowongandisimpan/melamar',
      views: {
        'tab-lowongandisimpan': {
          templateUrl: 'templates/lowongankerja/melamar.html',
          controller: 'MelamarCtrl'
        }
      }
  })

  .state('tab.lamaranku', 
  {
    url: '/lamaranku',
    abstract: true,
    views: {
      'tab-lamaranku': {
        templateUrl: 'templates/lamaranku/index.html',
        
      }
    }
  })
  .state('tab.lamaranku.new', 
  {
      url: "/new",
      views: 
      {
          'lamaranku-new': 
          {
              templateUrl: "templates/lamaranku/lamaranku-aktif.html",
              controller: 'LamaranKuCtrl'
          }
      },
  })
  .state('tab.lamaranku.end', 
  {
      url: "/end",
      views: 
      {
          'lamaranku-end': 
          {
              templateUrl: "templates/lamaranku/lamaranku-yanglalu.html",
              controller: 'LamaranKuCtrl'
          }
      },
  })
  .state('tab.notifikasi', {
    url: '/notifikasi',
    views: {
      'tab-notifikasi': {
        templateUrl: 'templates/notifikasi/index.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/profile/index.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.profile-datapribadi', {
    url: '/profile/datapribadi',
    views: {
      'tab-profile': {
        templateUrl: 'templates/profile/datapribadi.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.profile-pendidikan', {
    url: '/profile/pendidikan',
    views: {
      'tab-profile': {
        templateUrl: 'templates/profile/pendidikan.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.profile-bahasa', {
    url: '/profile/bahasa',
    views: {
      'tab-profile': {
        templateUrl: 'templates/profile/bahasa.html',
        controller: 'AccountCtrl'
      }
    }
  })
  
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/index.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.account-rekening', {
    url: '/account/rekening',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/rekening.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.account-profile', {
    url: '/account/profile',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/profile.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.account-password', {
    url: '/account/password',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/password.html',
        controller: 'AccountCtrl'
      }
    }
  })
  .state('tab.account-dokumen', {
    url: '/account/dokumen',
    views: {
      'tab-account': {
        templateUrl: 'templates/account/dokumen.html',
        controller: 'AccountCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/lowongankerja');

});