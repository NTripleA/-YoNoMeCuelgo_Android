angular.module('users')
.factory('LMIService', [
'$http',
function($http) {
	var LMIService = {};

	LMIService.getLMIData = function () {
		return $http.get("https://limitless-beach-28428.herokuapp.com/api/here")
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};

	LMIService.postLMIData = function (data) {
    		return $http.post("https://limitless-beach-28428.herokuapp.com/api/pur",
    		{
 				data
    		},
    		{
				headers: {'X-Requested-With': 'XMLHttpRequest',
			  	'Accept': 'application/json, text/plain, */*'
				}
			}
    		)
    		.then(function (response) {
    			return response.data;
    		})
    		.then(null, function (err) {
    			console.error(err);
    		});
    	};
	return LMIService;
}]);