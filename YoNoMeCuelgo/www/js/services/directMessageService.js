angular.module('users')
.factory('DirectMessageService', [
'$http',
function($http) {
	var DirectMessageService = {};
	  // var host = "http://localhost:8080";
  //  var host = "https://glacial-journey-85518.herokuapp.com";
	var host = "https://fierce-forest-40729.herokuapp.com";
	DirectMessageService.getDirectMessages = function (id) {
		return $http.get(host+"/studentMessages/"+id)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return DirectMessageService;
}]);
