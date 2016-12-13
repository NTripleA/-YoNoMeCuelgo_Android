angular.module('users')
.factory('tutorsService', [
'$http',
function($http) {
	var tutorsService = {};
	// var host = "http://localhost:8080";
  //  var host = "https://glacial-journey-85518.herokuapp.com";
	// var host = " https://sleepy-plains-69107.herokuapp.com";
	var host = "https://afternoon-beach-13945.herokuapp.com";

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

			tutorsService.removeCourse = function (data) {
		    		return $http.post(host+"/remove",data)
		    		.then(function (response) {
		    			return response.data;
		    		})
		    		.then(null, function (err) {
		    			console.error(err);
		    		});
		    	};

					tutorsService.updateAvailability = function (data) {
								console.log(JSON.stringify(data))
				    		return $http.post(host+"/availability",data)
				    		.then(function (response) {
				    			return response.data;
				    		})
				    		.then(null, function (err) {
				    			console.error(err);
				    		});
				    	};

					tutorsService.addCourses = function (data) {
				    		return $http.post(host+"/newCourses",data)
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

    tutorsService.addCourses = function(data)
    {
        console.log(data);
        return $http.post(host+"/newCourses",data)
        .then(function(response){
            return response.data;
        })
        .then(null, function (err) {
            console.error(err);
        });
    };

    tutorsService.otherCourses = function(id)
    {
      return $http.get(host+"/otherCourses/"+id)
          		.then(function (response) {
          			return response.data;
          		})
          		.then(null, function (err) {
          			console.error(err);
          		});
    }

	return tutorsService;
}]);
