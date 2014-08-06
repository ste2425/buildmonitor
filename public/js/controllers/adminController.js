app.controller('adminController', function($scope,$http,$route, $timeout,adminService){
    $scope.Errors = [];
    $scope.loaded = 0;

    $scope.updatePassword = function(user){
        var password = document.getElementById(user).value;
        adminService.updatePassword(user,password,function(data){
            if(data.ErrorMessage){
                $scope.Errors.push(data);
                $('#ErrorsPopup').show();
            }else{
                location.reload();
            }
        });
    }

    $scope.deploymentScreen = function(){
        window.location.replace("/menu");
    }

    $scope.deleteUser = function(user){
        adminService.deleteUser(user, function(data){
            if(data.ErrorMessage){
                $scope.Errors.push(data);
                $('#ErrorsPopup').show();
            }else{
                location.reload();
            }
        });
    }

    adminService.getUsers(function(data){
        if(data.ErrorMessage){
            $scope.Errors.push(data);
            $('#ErrorsPopup').show();
            $scope.users = [];
        }else{
        console.log(data);
        $scope.users = data;
         console.log($scope.users);
        }
    });

    $scope.logout = function(){
        adminService.logOut(function(data){
            if(data.ErrorMessage){
                $scope.Errors.push(data);
                $('#ErrorsPopup').show();
            }
        });
    }
});