angular.module('users')
.factory('countdownService', [
'$http',
function($http) {
	var countdownService = {};
	countdownService.getCountdown = function (id) {
		return $http.get("https://glacial-journey-85518.herokuapp.com/countdown/"+id)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return countdownService;
}]);
