app.factory('databaseBackupService', function($http){
	return{
		getDatabases: function(callback){
			var url = "/request/getDatabases";
			var errors = new errorsObject();
			$http({method: 'GET', url: url}).success(function(data, status, headers, config){
				callback(data);
				//console.log(data);
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
		logOut: function(){
			var url = "/logout";
			var errors = new errorsObject();
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
				console.log(errors.ErrorMessage);
			})
		}
	}
})