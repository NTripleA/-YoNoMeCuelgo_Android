angular.module('users')
.factory('tutorsService', [
'$http',
function($http) {
	var tutorsService = {};
	tutorsService.getTutors = function () {
		return $http.get("https://glacial-journey-85518.herokuapp.com/alltutors")
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};

	tutorsService.getTutorCourses = function (tutorID) {
    		return $http.get("https://glacial-journey-85518.herokuapp.com/tutorCourses/"+tutorID)
    		.then(function (response) {
    			return response.data;
    		})
    		.then(null, function (err) {
    			console.error(err);
    		});
    	};

    tutorsService.getTutorInfo = function(userID){
                 return $http.get("https://glacial-journey-85518.herokuapp.com/tutorInfo/"+userID)
                    .then(function(response) {
                        return response.data;
                    })
                    .then(null, function(err) {
                        console.error(err);
                    });
            };
    tutorsService.getDirectMessages = function (id) {
        		return $http.get("https://glacial-journey-85518.herokuapp.com/tutorMessages/"+id)
        		.then(function (response) {
        			return response.data;
        		})
        		.then(null, function (err) {
        			console.error(err);
        		});
        	};
	return tutorsService;
}]);
