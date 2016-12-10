angular.module('users')
.factory('accountsService', [
'$http',
function($http) {
    var host = "http://localhost:8080";
  //  var host = "https://glacial-journey-85518.herokuapp.com";
  // var host = "https://sleepy-plains-69107.herokuapp.com";
	var accountsService = {};

  accountsService.newUser = function(data) {
    return $http.post(host+"/newUser", data)
    .then(function(response) {
        return response.data;
    })
    .then(null, function(err) {
        console.error(err);
    });
  }

	accountsService.getUsers = function () {
		return $http.get(host+"/users")
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	accountsService.getUserById = function (userID) {
    		return $http.get(host+"/userInfo/"+userID)
    		.then(function (response) {
    			return response.data;
    		})
    		.then(null, function (err) {
    			console.error(err);
    		});
    	};

    accountsService.allCourses = function() {
        return $http.get(host+"/allCourses")
            		.then(function (response) {
            			return response.data;
            		})
            		.then(null, function (err) {
            			console.error(err);
            		});
    };
	return accountsService;
}]);
