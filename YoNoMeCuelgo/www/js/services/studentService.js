angular.module('users')
.factory('studentService', [
'$http',
function($http) {

  var host = "http://localhost:8080";
//  var host = "https://glacial-journey-85518.herokuapp.com";
  // var host = "https://fierce-forest-40729.herokuapp.com";
	var studentService = {};
	studentService.getStudents = function () {
		return $http.get(host+"/allstudents")
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};

	studentService.getStudentCourses = function(studentID){
	    return $http.get(host+"/studentCourses/"+studentID)
	    .then(function(response) {
	        return response.data;
	    })
	    .catch(null, function(err) {
	        console.error(err);
	    })

	}

	studentService.getStudentGroups = function(studentID){
    	    return $http.get(host+"/studentGroups/"+studentID)
    	    .then(function(response) {
    	        return response.data;
    	    })
    	    .then(null, function(err) {
    	        console.error(err);
    	    })

    }

    studentService.getAllGroups = function(){
        	    return $http.get(host+"/allgroups")
        	    .then(function(response) {
        	        return response.data;
        	    })
        	    .then(null, function(err) {
        	        console.error(err);
        	    })

        }

    studentService.getDirectMessages = function (id) {
    		return $http.get(host+"/studentMessages/"+id)
    		.then(function (response) {
    			return response.data;
    		})
    		.then(null, function (err) {
    			console.error(err);
    		});
    	}

    studentService.getCountdown = function(studentID){
            return $http.get(host+"/countdown/"+studentID)
                            .then(function(response) {
                                return response.data;
                            })
                            .then(null, function(err) {
                                console.error(err);
                            })

    }

    studentService.getStudentInfo = function(userID){
            return $http.get(host+"/studentInfo/"+userID)
                            .then(function(response) {
                                return response.data;
                            })
                            .then(null, function(err) {
                                console.log(err);
                            });

    }

     studentService.getGroupMessages = function (id) {
        		return $http.get(host+"/groupMessages/"+id)
        		.then(function (response) {
        			return response.data;
        		})
        		.then(null, function (err) {
        			console.error(err);
        		});
        	}
    studentService.getID = function(email)
    {       console.log("emailService: "+email);
            em = {"email":email};
            return $http.post(host+"/getId", em)
            .then(function(response) {
                return response.data;
            })
            .then(null, function(err) {
                console.error(err);
            });
    }

     studentService.newGroup = function(data)
        {
                return $http.post(host+"/createGroup", data)
                .then(function(response) {
                    return response.data;
                })
                .then(null, function(err) {
                    console.error(err);
                });
        }

     studentService.leaveGroup = function(data)
     {
              return $http.post(host+"/leave", data)
                     .then(function(response) {
                         return response.data;
                     })
                     .then(null, function(err) {
                         console.error(err);
                     });
     }

     studentService.setCountdown = function(data)
     {        console.log(JSON.stringify(data));
              return $http.put(host+"/newCountdown", data)
                      .then(function(response) {
                          console.log(response);
                          return response.data;
                      })
                      .then(null, function(err) {
                          console.error(err);
                      });

     }


	return studentService;
}]);
