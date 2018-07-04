angular.module('starter.services', [])

.service('ProviderPrefixService', function($rootScope,$window,$q,$http,$filter) 
{
    var GetPrefix  = function(provider)
    {
        if(provider == 'TELKOMSEL')
        {
            return /^0811|0812|0813|0821|0822|0823|0851|0852|0853/;
        }
        else if(provider == 'INDOSAT')
        {
            return /^0814|0815|0816|0855|0856|0857|0858/;
        }
        else if(provider == 'XL')
        {
            return /^0817|0818|0819|0859|0877|0878|0879|999|998/;
        }
        else if(provider == 'AXIS')
        {
            return /^0831|0832|0838/;
        }
        else if(provider == 'THREE')
        {
            return /^0895|0896|0897|0898|0899/;
        }
        else if(provider == 'SMARTFREN')
        {
            return /^0881|0882|0883|0884|0885|0886|0887|0888|0889/;
        }
    }

    var GetProviderByPrefix = function(prefix)
    {
        if(/^0811|0812|0813|0821|0822|0823|0851|0852|0853/.test(prefix))
        {
            return 'TELKOMSEL';
        }
        else if(/^0814|0815|0816|0855|0856|0857|0858/.test(prefix))
        {
            return 'INDOSAT';
        }
        else if(/^0817|0818|0819|0859|0877|0878|0879|999|998/.test(prefix))
        {
            return 'XL';
        }
        else if(/^0831|0832|0838/.test(prefix))
        {
            return 'AXIS';
        }
        else if(/^0895|0896|0897|0898|0899/.test(prefix))
        {
            return 'THREE';
        }
        else if(/^0881|0882|0883|0884|0885|0886|0887|0888|0889/.test(prefix))
        {
            return 'SMARTFREN';
        }

    }

    var GetGambarProvider = function(jenistransaksi,provider)
    {
      if(jenistransaksi == 'PULSA' || jenistransaksi == 'PULSAREGULER' || jenistransaksi == 'paketdata' || jenistransaksi == 'PAKETDATA')
      {
          return 'img/lg_' + $filter('lowercase')(provider) + '.png';
      }
      else if(jenistransaksi == 'TAGIHANPLN' || jenistransaksi == 'TOKENPLN')
      { 
          return 'img/lg_token.png';
      }
    }
    return {
      GetPrefix:GetPrefix,
      GetProviderByPrefix:GetProviderByPrefix,
      GetGambarProvider:GetGambarProvider
    };
})

.service('UtilService',function()
{
    var SqliteToArray = function(sqliteresult)
    {
      var panjang = sqliteresult.rows.length;
      var response = [];
      for(var i=0; i < panjang; i++)
      {
        response.push(sqliteresult.rows.item(i));
      }
      return response;
    }
    var CheckModalExistOrNot = function(datamodal)
    {
        if(datamodal)
        {
            if(!datamodal._isShown)
            {
                return true;
            }
            else
            {
                return false;
            }  
        }
        else
        {
            return true
        }
    }

    var GetPropinsis = function()
    {
        var propinsis =
        [
            {"PROVINCE_ID":"11","PROVINCE":"Aceh"},
            {"PROVINCE_ID":"12","PROVINCE":"Sumatera Utara"},
            {"PROVINCE_ID":"13","PROVINCE":"Sumatera Barat"},
            {"PROVINCE_ID":"14","PROVINCE":"Riau"},
            {"PROVINCE_ID":"15","PROVINCE":"Jambi"},
            {"PROVINCE_ID":"16","PROVINCE":"Sumatera Selatan"},
            {"PROVINCE_ID":"17","PROVINCE":"Bengkulu"},
            {"PROVINCE_ID":"18","PROVINCE":"Lampung"},
            {"PROVINCE_ID":"19","PROVINCE":"Kepulauan Bangka Belitung"},
            {"PROVINCE_ID":"21","PROVINCE":"Kepulauan Riau"},
            {"PROVINCE_ID":"24","PROVINCE":"Kalimantan Utara"},
            {"PROVINCE_ID":"31","PROVINCE":"Dki Jakarta"},
            {"PROVINCE_ID":"32","PROVINCE":"Jawa Barat"},
            {"PROVINCE_ID":"33","PROVINCE":"Jawa Tengah"},
            {"PROVINCE_ID":"34","PROVINCE":"Di Yogyakarta"},
            {"PROVINCE_ID":"35","PROVINCE":"Jawa Timur"},
            {"PROVINCE_ID":"36","PROVINCE":"Banten"},
            {"PROVINCE_ID":"51","PROVINCE":"Bali"},
            {"PROVINCE_ID":"52","PROVINCE":"Nusa Tenggara Barat"},
            {"PROVINCE_ID":"53","PROVINCE":"Nusa Tenggara Timur"},
            {"PROVINCE_ID":"61","PROVINCE":"Kalimantan Barat"},
            {"PROVINCE_ID":"62","PROVINCE":"Kalimantan Tengah"},
            {"PROVINCE_ID":"63","PROVINCE":"Kalimantan Selatan"},
            {"PROVINCE_ID":"64","PROVINCE":"Kalimantan Timur"},
            {"PROVINCE_ID":"65","PROVINCE":"Kalimantan Utara"},
            {"PROVINCE_ID":"71","PROVINCE":"Sulawesi Utara"},
            {"PROVINCE_ID":"72","PROVINCE":"Sulawesi Tengah"},
            {"PROVINCE_ID":"73","PROVINCE":"Sulawesi Selatan"},
            {"PROVINCE_ID":"74","PROVINCE":"Sulawesi Tenggara"},
            {"PROVINCE_ID":"75","PROVINCE":"Gorontalo"},
            {"PROVINCE_ID":"76","PROVINCE":"Sulawesi Barat"},
            {"PROVINCE_ID":"81","PROVINCE":"Maluku"},
            {"PROVINCE_ID":"82","PROVINCE":"Maluku Utara"},
            {"PROVINCE_ID":"91","PROVINCE":"Papua Barat"},
            {"PROVINCE_ID":"94","PROVINCE":"Papua"}
        ]
        return propinsis;
    }
    return {
      SqliteToArray:SqliteToArray,
      CheckModalExistOrNot:CheckModalExistOrNot,
      GetPropinsis:GetPropinsis
    }
})

.service('StorageService',function($window)
{
   var set = function(key,value)
   {
      return $window.localStorage.setItem(key,JSON.stringify(value));
   }
   var get = function(key)
   {
     return JSON.parse(localStorage.getItem(key));
   }
   var destroy = function(key)
   {
     return $window.localStorage.removeItem(key);
   }

   return {
      set:set,
      get:get,
      destroy:destroy
   }
})
.service('ToastService',function(toastr,$cordovaToast)
{
   var ShowToast = function(message,status)
   {
      if (window.cordova && window.cordova.plugins) 
      {
        $cordovaToast.show(message, 'long', 'bottom');
      }
      else
      {
        if(status == 'success')
        {
            toastr.success(message);
        }
        else if(status == 'error')
        {
            toastr.error(message);
        }
      }
   }
   

   return {
      ShowToast:ShowToast
   }
})

.service('LowonganService',function($window)
{
   var GetLowongans = function(key,value)
   {
      var lowongan =
      [
        {
          'ID_LOCAL':'LOW-001',
          'NAMA_LOWONGAN':'Web Developer',
          'NAMA_PERUSAHAAN':'PT Indodev Niaga',
          'LOKASI_PERUSAHAAN':'Tangerang Selatan,Banten',
          'MIN_GAJI':5000000,
          'MAX_GAJI':8000000,
          'PENGALAMAN':'2 Tahun Non Supervisor',
          'TGL_BUKALOWONGAN':'2019-07-03',
          'TGL_TUTUPLOWONGAN':'2018-08-03',
          'DESKRIPSI':'Text Deskripsi Akan Ada Disini'
        },
        {
          'ID_LOCAL':'LOW-002',
          'NAMA_LOWONGAN':'Web Developer',
          'NAMA_PERUSAHAAN':'PT Pancabudi',
          'LOKASI_PERUSAHAAN':'Tangerang,Banten',
          'MIN_GAJI':5000000,
          'MAX_GAJI':8000000,
          'PENGALAMAN':'2 Tahun Non Supervisor',
          'TGL_BUKALOWONGAN':'2019-07-03',
          'TGL_TUTUPLOWONGAN':'2018-08-03',
          'DESKRIPSI':'Text Deskripsi Akan Ada Disini'
        },
        {
          'ID_LOCAL':'LOW-003',
          'NAMA_LOWONGAN':'Web Programmer',
          'NAMA_PERUSAHAAN':'PT Datacomm',
          'LOKASI_PERUSAHAAN':'Jakarta Selatan, DKI Jakarta',
          'MIN_GAJI':6000000,
          'MAX_GAJI':8000000,
          'PENGALAMAN':'2 Tahun Non Supervisor',
          'TGL_BUKALOWONGAN':'2019-07-03',
          'TGL_TUTUPLOWONGAN':'2018-08-03',
          'DESKRIPSI':'Text Deskripsi Akan Ada Disini'
        },
        {
          'ID_LOCAL':'LOW-004',
          'NAMA_LOWONGAN':'Accounting',
          'NAMA_PERUSAHAAN':'PT Datacomm',
          'LOKASI_PERUSAHAAN':'Jakarta Selatan, DKI Jakarta',
          'MIN_GAJI':6000000,
          'MAX_GAJI':8000000,
          'PENGALAMAN':'2 Tahun Non Supervisor',
          'TGL_BUKALOWONGAN':'2019-07-03',
          'TGL_TUTUPLOWONGAN':'2018-08-03',
          'DESKRIPSI':'Text Deskripsi Akan Ada Disini'
        },
        {
          'ID_LOCAL':'LOW-005',
          'NAMA_LOWONGAN':'Sales Executive',
          'NAMA_PERUSAHAAN':'PT Datacomm',
          'LOKASI_PERUSAHAAN':'Jakarta Selatan, DKI Jakarta',
          'MIN_GAJI':6000000,
          'MAX_GAJI':8000000,
          'PENGALAMAN':'2 Tahun Non Supervisor',
          'TGL_BUKALOWONGAN':'2019-07-03',
          'TGL_TUTUPLOWONGAN':'2018-08-03',
          'DESKRIPSI':'Text Deskripsi Akan Ada Disini'
        }

      ]
      return lowongan;
   }

   return {
      GetLowongans:GetLowongans
   }
})


