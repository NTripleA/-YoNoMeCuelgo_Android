angular.module('users')
.factory('accountsService', [
'$http',
function($http) {
	var accountsService = {};
	accountsService.getUsers = function () {
		return $http.get("https://glacial-journey-85518.herokuapp.com/users")
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	accountsService.getUserById = function (userID) {
    		return $http.get("https://glacial-journey-85518.herokuapp.com/userInfo/"+userID)
    		.then(function (response) {
    			return response.data;
    		})
    		.then(null, function (err) {
    			console.error(err);
    		});
    	};

    accountsService.allCourses = function() {
        return $http.get("https://glacial-journey-85518.herokuapp.com/allCourses")
            		.then(function (response) {
            			return response.data;
            		})
            		.then(null, function (err) {
            			console.error(err);
            		});
    };
	return accountsService;
}]);