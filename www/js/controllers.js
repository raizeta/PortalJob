angular.module('starter.controllers', [])
.controller('DashCtrl', function(ToastService,LowonganService,StorageService,$filter,$scope,$state,$timeout,$ionicHistory,$ionicLoading,$stateParams,$ionicModal) 
{
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
        $scope.datalowongan       = LowonganService.GetLowongans();
        $scope.lowongantersimpan  = StorageService.get('lowongantersimpan') || [];
        $scope.listlamaranku      = StorageService.get('lamaranku')||[];
    });
    $scope.filterpropinsi     = StorageService.get('filterpropinsi')||[];
    $scope.filternamalowongan = StorageService.get('namalowongan') || undefined;
    if($scope.filterpropinsi.length > 0)
    {
        $scope.filterpropinsi = $scope.filterpropinsi;
    }
    else
    {
        $scope.filterpropinsi = undefined;
    }
  
    $scope.apakahdisimpan = function(lowongan)
    {
        var indexdidatalowongan = _.findIndex($scope.lowongantersimpan,{'ID_LOCAL':lowongan.ID_LOCAL});
        if(indexdidatalowongan > -1)
        {
          return true;  
        }
        return false;  
    }

    $scope.apakahsudahdilamar = function(lowongan)
    {
        var indexdidatalamaranku = _.findIndex($scope.listlamaranku,{'ID_LOCAL':lowongan.ID_LOCAL});
        if(indexdidatalamaranku > -1)
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

    $scope.gotomelamar = function(lowongan)
    {
        StorageService.set('lowonganyangdilamar',lowongan);
        if($state.current.name == 'tab.lowongankerja')
        {
          $state.go('tab.lowongankerja-melamar');
        }
        else
        {
          $state.go('tab.lowongandisimpan-melamar'); 
        }
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

.controller('MelamarCtrl', function($timeout,$state,$scope,$filter,$ionicModal,ToastService,UtilService,StorageService) 
{
    $scope.lowongantersimpan  = StorageService.get('lowongantersimpan') || [];
    $scope.lowongan           = StorageService.get('lowonganyangdilamar');
    $scope.listlamaranku      = StorageService.get('lamaranku')||[];
    $scope.indexdilamaranku   = _.findIndex($scope.listlamaranku,{'ID_LOCAL':$scope.lowongan.ID_LOCAL});

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
        if($scope.indexdilamaranku == -1)
        {
            $scope.listlamaranku.push($scope.lowongan);
            StorageService.set('lamaranku',$scope.listlamaranku);
        }
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
    $scope.apakahdisimpan = function(lowongan)
    {
        var indexdidatalowongan = _.findIndex($scope.lowongantersimpan,{'ID_LOCAL':lowongan.ID_LOCAL});
        if(indexdidatalowongan > -1)
        {
          return true;  
        }
        return false;  
    }
})

.controller('LamaranKuCtrl', function($scope,$state,$filter,$ionicModal,ToastService,UtilService,StorageService) 
{
    $scope.listlamaranku     = StorageService.get('lamaranku')||[];
    $scope.$on('$ionicView.beforeEnter', function(parameters)
    {
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

    $scope.modallamarankuopen = function(lamaranku)
    {
        $ionicModal.fromTemplateUrl('templates/lamaranku/modallamaranku.html', 
        {
            scope: $scope,
            backdropClickToClose: true,
            hardwareBackButtonClose: false
        })
        .then(function(modal) 
        {
            var resultcheckmodal = UtilService.CheckModalExistOrNot($scope.modallamaranku);
            if(resultcheckmodal)
            {
                $scope.lowongan         = angular.copy(lamaranku);
                $scope.modallamaranku   = modal;
                $scope.modallamaranku.show();
            }
        });
    }
    $scope.modallamarankuclose = function()
    {
        $scope.modallamaranku.remove();   
    }
})

.controller('AccountCtrl', function($ionicActionSheet,$state,$scope,$ionicHistory,StorageService,$timeout,$ionicLoading,$location) 
{
    $scope.dataPribadi      = StorageService.get('advanced-profile');
    $scope.dataPendidikan   = {'kualifikasi':undefined};
    $scope.dataBahasa       = {'bahasadikuasai':'','membaca':5,'menulis':5,'berbicara':5}
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
    $scope.pilihjeniskelamin = function() 
    {
    
        $ionicActionSheet.show({
          titleText: 'Pilih Jenis Kelamin',
          buttons: 
          [
            { text: '<i class="icon ion-male"></i> Laki-laki' },
            { text: '<i class="icon ion-female"></i> Perempuan' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                $scope.dataPribadi.LAHIR_GENDER = 'Laki-laki';
            }
            else
            {
               $scope.dataPribadi.LAHIR_GENDER = 'Perempuan'; 
            }
            return true;
          }
        });
    };
    $scope.pilihstatuspernikahan = function(statuscreateorupdate) 
    {
    
        $ionicActionSheet.show({
          titleText: 'Pilih Status Pernikahan',
          buttons: 
          [
            { text: '<i class="icon ion-person"></i>Belum Menikah' },
            { text: '<i class="icon ion-person-stalker"></i>Sudah Menikah' },
            { text: '<i class="icon ion-person-add"></i>Single Parent' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.dataPribadi.STS_NIKAH = 'Belum Menikah';    
                }
                else
                {
                    $scope.dataPribadi.STS_NIKAH = 'Belum Menikah'; 
                }
            }
            else if(index == 1)
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.dataPribadi.STS_NIKAH = 'Sudah Menikah';    
                }
                else
                {
                    $scope.dataPribadi.STS_NIKAH = 'Sudah Menikah'; 
                } 
            }
            else if(index == 2)
            {
                if(statuscreateorupdate == 'create')
                {
                    $scope.dataPribadi.STS_NIKAH = 'Single Parent';    
                }
                else
                {
                    $scope.dataPribadi.STS_NIKAH = 'Single Parent'; 
                } 
            }
            return true;
          }
        });
    };
    $scope.pilihkualifikasipendidikan = function(statuscreateorupdate) 
    {
    
        $ionicActionSheet.show(
        {
          titleText: 'Pilih Status Pernikahan',
          buttons: 
          [
            { text: '<i class="icon ion-ribbon-a"></i>SD' },
            { text: '<i class="icon ion-ribbon-a"></i>SMP' },
            { text: '<i class="icon ion-ribbon-a"></i>SMA/SMK' },
            { text: '<i class="icon ion-ribbon-a"></i>Diploma' },
            { text: '<i class="icon ion-ribbon-a"></i>Sarjana' },
            { text: '<i class="icon ion-ribbon-a"></i>Pasca Sarjana' },
            { text: '<i class="icon ion-ribbon-a"></i>Doktor' },
          ],
          cancelText: 'Cancel',
          buttonClicked: function(index) 
          {
            if(index == 0)
            {
                $scope.dataPendidikan.kualifikasi = 'SD';
            }
            if(index == 1)
            {
                $scope.dataPendidikan.kualifikasi = 'SMP';
            }
            if(index == 2)
            {
                $scope.dataPendidikan.kualifikasi = 'SMA/SMK';
            }
            if(index == 3)
            {
                $scope.dataPendidikan.kualifikasi = 'Diploma';
            }
            if(index == 4)
            {
                $scope.dataPendidikan.kualifikasi = 'Sarjana';
            }
            if(index == 5)
            {
                $scope.dataPendidikan.kualifikasi = 'Pasca Sarjana';
            }
            if(index == 6)
            {
                $scope.dataPendidikan.kualifikasi = 'Doktor';
            }
            return true;
          }
        });
    };

    $scope.submitdatapribadi = function()
    {
        StorageService.set('advanced-profile',$scope.dataPribadi);
        $state.go('tab.profile');
    }

    $scope.submitdatapendidikan = function()
    {
        $state.go('tab.profile');
    }
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
