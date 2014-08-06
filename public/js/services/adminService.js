app.factory('adminService', function($http){
	return{
		updatePassword: function(user, password, callback){
			var url = "/request/updateuserpassword?user=" + user+"&password="+password;
			var errors = new errorsObject("");
			$http({method: 'GET', url: url}).success(function(data, status, headers, config){
				callback(data);
				console.log("done");
			}).error(function(data, status, headers, config){
				//Failed HTTP call
				if(status){
					errors.ErrorMessage = data;
					errors.Status = status;
				}else{
					errors.ErrorMessage = "Connection to node server lost.";
					errors.Status = 0;
				}
				callback(errors);
			})
		},
		deleteUser: function(user, callback){
			var url = "/request/deleteuser?user=" + user;
			var errors = new errorsObject("");
			$http({method: 'GET', url: url}).success(function(data, status, headers, config){
				callback(data);
				console.log("done");
			}).error(function(data, status, headers, config){
				//Failed HTTP call
				if(status){
					errors.ErrorMessage = data;
					errors.Status = status;
				}else{
					errors.ErrorMessage = "Connection to node server lost.";
					errors.Status = 0;
				}
				callback(errors);
			})
		},
		getUsers: function(callback){
			var url = "/request/getUserList";
			var errors = new errorsObject("");
			$http({method: 'GET', url: url}).success(function(data, status, headers, config){
				callback(data);
			}).error(function(data, status, headers, config){
				//Failed HTTP call
				if(status){
					errors.ErrorMessage = data;
					errors.Status = status;
				}else{
					errors.ErrorMessage = "Connection to node server lost.";
					errors.Status = 0;
				}
				callback(errors);
			})
		},
		logOut: function(callback){
			var url = "/logout";
			var errors = new errorsObject("");
			$http({method: 'GET', url: url}).success(function(data, status, headers, config){
					window.location = data.redirect;
			}).error(function(data, status, headers, config){
				//Failed HTTP call
				if(status){
					errors.ErrorMessage = data;
					errors.Status = status;
				}else{
					errors.ErrorMessage = "Connection to node server lost.";
					errors.Status = 0;
				}
				callback(errors);
			})
		}
	}
})