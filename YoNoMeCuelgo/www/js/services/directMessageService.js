angular.module('users')
.factory('DirectMessageService', [
'$http',
function($http) {
	var DirectMessageService = {};
	DirectMessageService.getDirectMessages = function (id) {
		return $http.get("http://glacial-journey-85518.herokuapp.com/studentMessages/"+id)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return DirectMessageService;
}]);
