angular.module('starter.controllers', [])
.controller('DashCtrl', function(ToastService,LowonganService,StorageService,$filter,$scope,$state,$timeout,$ionicHistory,$ionicLoading,$stateParams,$ionicModal) 
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
      $scope.datalowongan       = LowonganService.GetLowongans();
      $scope.lowongantersimpan  = StorageService.get('lowongantersimpan') || [];
    });

    $scope.apakahdisimpan = function(lowongan)
    {
        var indexdidatalowongan = _.findIndex($scope.lowongantersimpan,{'ID_LOCAL':lowongan.ID_LOCAL});
        if(indexdidatalowongan > -1)
        {
          return true;  
        }
        return false;  
    }
    $scope.addorremove = function(lowongan)
    {
        var indexdidatalowongan = _.findIndex($scope.lowongantersimpan,{'ID_LOCAL':lowongan.ID_LOCAL});
        if(indexdidatalowongan > -1)
        {
          $scope.lowongantersimpan.splice(indexdidatalowongan,1);
          ToastService.ShowToast('Dihapus Dari Lowongan Tersimpan','success');  
        }
        else
        {
          $scope.lowongantersimpan.push({'ID_LOCAL':lowongan.ID_LOCAL});
          ToastService.ShowToast('Ditambahkan Ke Lowongan Tersimpan','success');
        }
        StorageService.set('lowongantersimpan',$scope.lowongantersimpan);   
    }
    $scope.filterpropinsi     = StorageService.get('filterpropinsi')||[];
    $scope.filternamalowongan = StorageService.get('namalowongan');
    if($scope.filterpropinsi.length > 0)
    {
        $scope.filterpropinsi = $scope.filterpropinsi;
    }
    else
    {
        $scope.filterpropinsi = undefined;
    }

    $scope.gotomelamar = function(lowongan)
    {
        $state.go('tab.lowongankerja-melamar');
        StorageService.set('lowonganyangdilamar',lowongan);
    }

})
.controller('FilteringCtrl', function($scope,$state,$filter,$ionicModal,UtilService,StorageService) 
{
    $scope.data                   = {'volume':3};
    $scope.dataprovinsis          = UtilService.GetPropinsis();
    $scope.namalowongan           = {'namalowongan':StorageService.get('namalowongan')||''};
    $scope.filterpropinsi         = StorageService.get('filterpropinsi')||[];
    if($scope.filterpropinsi.length > 0)
    {
        var propinsi = {};
        angular.forEach($scope.filterpropinsi,function(value,key)
        {
            propinsi[value] = true;
        });
        $scope.selection              = {ids: propinsi};
        $scope.beforeselection        = angular.copy($scope.selection);
    }
    else
    {
        $scope.selection              = {ids: {}};
        $scope.beforeselection        = angular.copy($scope.selection);
    }
    
    $scope.modalprovinsiopen  = function()
    {
        $ionicModal.fromTemplateUrl('templates/lowongankerja/modalprovinsi.html', 
        {
            scope: $scope,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modalprovinsi);
            if(resultcheckmodal)
            {
                $scope.modalprovinsi  = modal;
                $scope.modalprovinsi.show();
            }
        });
    }

    $scope.modalprovinsisubmit = function()
    {
      $scope.filterpropinsi = [];
      angular.forEach($scope.selection.ids,function(value,key)
      {
          if(value)
          {
            $scope.filterpropinsi.push(key);  
          }
          
      })
      
      $scope.modalprovinsi.remove();
    }

    $scope.simpansemuafilter = function()
    {
        StorageService.set('filterpropinsi',$scope.filterpropinsi);
        StorageService.set('namalowongan',$scope.namalowongan.namalowongan);
        $state.go('tab.lowongankerja');
    }
})

.controller('MelamarCtrl', function($timeout,$state,$scope,$filter,$ionicModal,UtilService,StorageService) 
{
    $scope.lowongan = StorageService.get('lowonganyangdilamar');
    $scope.melamarsekarang = function()
    {
        $ionicModal.fromTemplateUrl('templates/lowongankerja/modallamaran.html', 
        {
            scope: $scope,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modallamaran);
            if(resultcheckmodal)
            {
                $scope.modallamaran  = modal;
                $scope.modallamaran.show();
            }
        });
    }
    $scope.modallamaransubmit = function()
    {
      $scope.modallamaran.remove();
      $timeout(function() 
      {
          $state.go('tab.lowongankerja');
      },500);
    }
    $scope.modallamaranclose = function()
    {
      $scope.modallamaran.remove();
    }
})
.controller('TopUpCtrl',function($scope,$ionicActionSheet,$ionicLoading,$timeout,$filter,RekOwnerService,StorageService,TopUpFac)
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        $scope.datasaldo    = StorageService.get('data-saldo');
        if(!$scope.datasaldo)
        {
          $scope.datasaldo = 0;
        }
        $scope.datarekening = RekOwnerService.GetRekenings();
        $scope.rekeningforactionsheet = [];
        angular.forEach($scope.datarekening,function(value,key)
        {
            var data  = {};
            data.text = '<i class="icon ion-share"></i>' + value.NAMA_BANK;
            $scope.rekeningforactionsheet.push(data);
        })
        $scope.bisatopup = {'status':true};
    });

    $scope.topUp     = {};
    $scope.show = function() 
    {
     $ionicActionSheet.show({
       buttons: $scope.rekeningforactionsheet,
       titleText: 'Pilih Rekening Tujuan Transfer',
       buttonClicked: function(index) 
        {
            $scope.topUp.NAMA_BANK        = $scope.datarekening[index].NAMA_BANK;
            $scope.topUp.NOMOR_REKENING   = $scope.datarekening[index].NOMOR_REKENING;
            $scope.topUp.NAMA_PEMILIK     = $scope.datarekening[index].NAMA_PEMILIK;
            return true;
        }
     });
    };
    $scope.submittopup = function()
    {
      $ionicLoading.show
      ({
          noBackdrop:false,
          hideOnStateChange:true,
          template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
          duration:5000
      })
      .then(function()
      {
          $scope.topUp.WAKTU_TOPUP  = $filter('date')(new Date(),'dd-MM-yyyy HH:mm:ss');
          $scope.topUp.STATUS_TOPUP = 1;
          TopUpFac.CreateTopUp($scope.topUp)
          .then(function(response)
          {
              $scope.datasaldo = Number($scope.datasaldo) + Number(angular.copy($scope.topUp.NOMINAL_TOPUP)); 
              StorageService.set('data-saldo',$scope.datasaldo);
              $scope.topUp = {};
              // $scope.bisatopup = {'status':false};
              // $scope.datatopupdalamproses = $scope.topUp;
          },
          function(error)
          {
              console.log(error);
          });
      });
      
    }
})
.controller('HistoryTopUpCtrl',function($scope,$ionicActionSheet,$ionicLoading,$timeout,$filter,TopUpFac)
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        TopUpFac.GetTopUps()
        .then(function(response)
        {
            $scope.datatopup = response;
        },
        function(error)
        {
            console.log(response);
        });
    });
})
.controller('AccountCtrl', function($scope,$ionicHistory,StorageService,$timeout,$ionicLoading,$location) 
{
    $scope.userprofile = StorageService.get('advanced-profile');
    $scope.logout = function() 
    {

        StorageService.destroy('advanced-profile');
        StorageService.destroy('basic-parameters');
        $ionicLoading.show({template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',duration:1000});
        $timeout(function () 
        {
              $ionicLoading.hide();
              $ionicHistory.clearCache();
              $ionicHistory.clearHistory();
              $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
              $location.path('/auth/login');
          }, 1500);
    };
})
.controller('LoginCtrl',function($scope,$state,$ionicLoading,$timeout,$ionicHistory,UsersFac,StorageService)
{
    $scope.datauserlogin = {};
    $scope.loginsubmit = function()
    {
      $ionicLoading.show
      ({
          noBackdrop:false,
          hideOnStateChange:true,
          template: '<p class="item-icon-left"><span class="title">Loading</span><ion-spinner icon="lines"/></p>',
      });
      UsersFac.UserLogin($scope.datauserlogin)
      .then(function(response)
      {
          if(response.length > 0)
          {
            $timeout(function() 
            {
                StorageService.set('advanced-profile',response[0]);
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('tab.lowongankerja', {}, {reload: false});
            }, 100);
          }
      },
      function(error)
      {
          if(error == 'credential-wrong');
          {
              alert("Credential Wrong.Periksa Email dan Password Anda");
          }
      })
      .finally(function()
      {
          $ionicLoading.hide();
      });
    }
})

.controller('RegistrasiCtrl',function($scope,$state,$ionicLoading,$timeout,$ionicHistory,UsersFac,StorageService)
{
    $scope.newmember = {};
    $scope.registrasinewmember = function()
    {
        UsersFac.CreateUsers($scope.newmember)
        .then(function(response)
        {
            $timeout(function() 
            {
                StorageService.set('advanced-profile',$scope.newmember);
                $ionicHistory.nextViewOptions({disableAnimate: true, disableBack: true});
                $state.go('tab.lowongankerja', {}, {reload: false});
            }, 100);
        },
        function(error)
        {
            if(error.code === 6)
            {
                var err = error.message.split('.')[1].slice(0,-1);
                if(err == 'ALAMAT_EMAIL')
                {
                    alert("Email Sudah Terdaftar.Silahkan Login");
                }
                else if(err == 'NOMOR_HANDPHONE')
                {
                    alert("Nomor Handphone Sudah Terdaftar.Silahkan Login");
                } 
            }
            
        })
    } 
});
