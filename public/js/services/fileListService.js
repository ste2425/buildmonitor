app.factory('fileListService', function($http) {
	return {
		getBuilds: function(callback) {
			$http({
				method: 'GET',
				url: '/read'
			}).success(function(data, status, headers, config) {
				callback(null, data);
			}).error(function(data, status, headers, config) {
				//Failed HTTP call
				callback({
					Error: data,
					Status: status,
					Headers: headers
				}, null);
			})
		}
	}
})