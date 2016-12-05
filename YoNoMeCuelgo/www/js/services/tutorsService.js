angular.module('users')
.factory('tutorsService', [
'$http',
function($http) {
	var tutorsService = {};
	  var host = "http://localhost:8080";
  //  var host = "https://glacial-journey-85518.herokuapp.com";
	tutorsService.getTutors = function () {
		return $http.get(host+"/alltutors")
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};

	tutorsService.getTutorCourses = function (tutorID) {
    		return $http.get(host+"/tutorCourses/"+tutorID)
    		.then(function (response) {
    			return response.data;
    		})
    		.then(null, function (err) {
    			console.error(err);
    		});
    	};

    tutorsService.getTutorInfo = function(userID){
                 return $http.get(host+"/tutorInfo/"+userID)
                    .then(function(response) {
                        return response.data;
                    })
                    .then(null, function(err) {
                        console.error(err);
                    });
            };
    tutorsService.getDirectMessages = function (id) {
        		return $http.get(host+"/tutorMessages/"+id)
        		.then(function (response) {
        			return response.data;
        		})
        		.then(null, function (err) {
        			console.error(err);
        		});
        	};
	return tutorsService;
}]);
