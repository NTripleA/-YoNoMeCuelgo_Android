angular.module('users')
.factory('settingsService', [
'$http',
function($http) {
	var settingsService = {};
	settingsService.getUserInfo = function (id) {
		return $http.get("https://glacial-journey-85518.herokuapp.com/userInfo/"+id)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return settingsService;
}]);
