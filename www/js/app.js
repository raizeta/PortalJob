// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova','starter.controllers', 'starter.services','toastr'])

.run(function($ionicPlatform,$rootScope,$location,$cordovaSQLite,StorageService,$ionicPopup) 
{
  $ionicPlatform.ready(function() 
  {
    var notificationOpenedCallback = function(jsonData) 
    {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };

    window.plugins.OneSignal
      .startInit("9c5a6669-9b19-4622-bbc2-7db5f94e8f07")
      .handleNotificationOpened(notificationOpenedCallback)
      .endInit();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) 
    {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        
    }
    
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) 
    {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) 
    {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $rootScope.db = window.openDatabase("protojobstreet.db", "1.0", "Your App", 2000000000000);
  $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_LowonganKerja (ID_LOWONGAN INTEGER PRIMARY KEY AUTOINCREMENT,NAMA_LOWONGAN TEXT,NAMA_PERUSAHAAN TEXT,LOKASI_PERUSAHAAN TEXT,MIN_GAJI INTEGER,MAX_GAJI INTEGER,PENGALAMAN TEXT,TGL_BUKALOWONGAN TEXT,TGL_TUTUPLOWONGAN TEXT,DESKRIPSI TEXT)');
  $cordovaSQLite.execute($rootScope.db, 'CREATE TABLE IF NOT EXISTS Tbl_Users (ID_LOCAL INTEGER PRIMARY KEY AUTOINCREMENT,ALAMAT_EMAIL TEXT,USER_PASSWORD TEXT,NOMOR_HANDPHONE TEXT UNIQUE,NAMA_LENGKAP TEXT)'); 
  
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) 
  {
      var token   = StorageService.get('advanced-profile');
      if (!token) 
      {
        $location.path('/auth/login');
        console.log();
      }
  });
  
})

