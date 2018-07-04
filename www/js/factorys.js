angular.module('starter')
.factory('LowonganFac',function($rootScope,$q,$cordovaSQLite,UtilService)
{
    var GetLowongans = function ()
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Transaksi Order By ID_LOCAL DESC';
        $cordovaSQLite.execute($rootScope.db,query,[])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.resolve([]);
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var CreateLowongan = function (datatosave)
    {
        var deferred            = $q.defer();
        var NAMA_LOWONGAN       = datatosave.NAMA_LOWONGAN;
        var NAMA_PERUSAHAAN     = datatosave.NAMA_PERUSAHAAN;
        var LOKASI_PERUSAHAAN   = datatosave.LOKASI_PERUSAHAAN;
        var MIN_GAJI            = datatosave.MIN_GAJI;
        var MAX_GAJI            = datatosave.MAX_GAJI;
        var PENGALAMAN          = datatosave.PENGALAMAN;
        var TGL_BUKALOWONGAN    = datatosave.TGL_BUKALOWONGAN;
        var TGL_TUTUPLOWONGAN   = datatosave.TGL_TUTUPLOWONGAN;
        var DESKRIPSI           = datatosave.DESKRIPSI;

        var isitable        = [NAMA_LOWONGAN,NAMA_PERUSAHAAN,LOKASI_PERUSAHAAN,MIN_GAJI,MAX_GAJI,PENGALAMAN,TGL_BUKALOWONGAN,TGL_TUTUPLOWONGAN,DESKRIPSI]
        var query           = 'INSERT INTO Tbl_LowonganKerja (NAMA_LOWONGAN,NAMA_PERUSAHAAN,LOKASI_PERUSAHAAN,MIN_GAJI,MAX_GAJI,PENGALAMAN,TGL_BUKALOWONGAN,TGL_TUTUPLOWONGAN,DESKRIPSI) VALUES (?,?,?,?,?,?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }

    
    
    return{
            GetLowongans:GetLowongans,
            CreateLowongan:CreateLowongan,

        }
})
.factory('UsersFac',function($rootScope,$q,$cordovaSQLite,UtilService)
{
    var UserLogin = function (parameter)
    {
        var deferred    = $q.defer();
        var query       = 'SELECT * FROM Tbl_Users WHERE ALAMAT_EMAIL = ? AND USER_PASSWORD = ?';
        $cordovaSQLite.execute($rootScope.db,query,[parameter.ALAMAT_EMAIL,parameter.USER_PASSWORD])
        .then(function(result) 
        {
            if(result.rows.length > 0)
            {
                var response = UtilService.SqliteToArray(result);
                deferred.resolve(response);
            }
            else
            {
                deferred.reject("credential-wrong");
            }
        },
        function (error)
        {
            deferred.reject(error); 
        });
        return deferred.promise;
    }

    var CreateUsers = function (datatosave)
    {
        var deferred            = $q.defer();
        var ALAMAT_EMAIL        = datatosave.ALAMAT_EMAIL;
        var USER_PASSWORD       = datatosave.USER_PASSWORD;
        var NOMOR_HANDPHONE     = datatosave.NOMOR_HANDPHONE;
        var NAMA_LENGKAP        = datatosave.NAMA_LENGKAP;

        var isitable            = [ALAMAT_EMAIL,USER_PASSWORD,NOMOR_HANDPHONE,NAMA_LENGKAP]
        var query               = 'INSERT INTO Tbl_Users (ALAMAT_EMAIL,USER_PASSWORD,NOMOR_HANDPHONE,NAMA_LENGKAP) VALUES (?,?,?,?)';
        $cordovaSQLite.execute($rootScope.db,query,isitable)
        .then(function(result) 
        {
            deferred.resolve(result);
        },
        function (error)
        {
            deferred.reject(error);
        });
        return deferred.promise; 
    }
    return{
            UserLogin:UserLogin,
            CreateUsers:CreateUsers
        }
});