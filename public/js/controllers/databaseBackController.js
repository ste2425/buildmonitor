app.controller('databaseBackupController', function($scope,$http,$route, $timeout,databaseBackupService){
    $scope.Errors = [];
    
   $scope.deploymentScreen = function(){
        window.location.replace("/menu");
    }

    $scope.deleteUser = function(user){
        databaseBackupService.deleteUser(user);
    }
    $scope.refresh = function(){
        getdatabase();
    }
    getdatabase();
    function getdatabase(){
        databaseBackupService.getDatabases(function(data){
            if(data.ErrorMessage){
                $scope.Errors.push(data);
                $('#ErrorsPopup').show();
            }else{
                $scope.databases = data;
            }
        });
    }

    $scope.logout = function(){
        databaseBackupService.logOut();
    }
});