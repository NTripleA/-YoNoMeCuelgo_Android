angular.module('users')
.factory('settingsService', [
'$http',
function($http) {
	var settingsService = {};
	  // var host = "http://localhost:8080";
  //  var host = "https://glacial-journey-85518.herokuapp.com";
	var host = "https://fierce-forest-40729.herokuapp.com";
	settingsService.getUserInfo = function (id) {
		return $http.get(host+"/userInfo/"+id)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return settingsService;
}]);
