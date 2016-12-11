angular.module('users')
.factory('countdownService', [
'$http',
function($http) {
	var countdownService = {};
	  var host = "http://localhost:8080";
  //  var host = "https://glacial-journey-85518.herokuapp.com";
	// var host = "https://afternoon-beach-13945.herokuapp.com";

	countdownService.getCountdown = function (id) {
		return $http.get(host+"/countdown/"+id)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return countdownService;
}]);
