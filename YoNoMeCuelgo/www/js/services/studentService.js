angular.module('users')
.factory('studentService', [
'$http',
function($http) {

  var host = "http://localhost:8080";
//  var host = "https://glacial-journey-85518.herokuapp.com";
  // var host = " https://sleepy-plains-69107.herokuapp.com";
  // var host = "https://afternoon-beach-13945.herokuapp.com";

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

        studentService.getOtherGroups = function(id){
            	    return $http.get(host+"/otherGroups/"+id)
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
        console.log("userId inside service:" + userID);
            return $http.get(host+"/studentInfo/"+userID)
                            .then(function(response) {
                              console.log("response of getstudentinfo: " + response.data);
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
    studentService.getID = function(email){
            var data = {"email":email}
            return $http.post(host+"/getId", data)
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

      studentService.joinGroup = function(data)
         {
                 return $http.post(host+"/joinGroup", data)
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

     studentService.updateSettings = function(data)
        {
                return $http.put(host+"/updateSettings", data)
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

     studentService.sendMessage = function(data){
              return $http.post(host+"/messageTutor", data)
                      .then(function(response) {
                          console.log(response);
                          return response.data;
                      })
                      .then(null, function(err) {
                          console.error(err);
                      });

     }


     studentService.sendGroupMessage = function(data){
              return $http.post(host+"/messageGroup", data)
                      .then(function(response) {
                          console.log(response);
                          return response.data;
                      })
                      .then(null, function(err) {
                          console.error(err);
                      });

     }

     studentService.otherCourses = function(id)
     {
       return $http.get(host+"/otherStudentCourses/"+id)
           		.then(function (response) {
           			return response.data;
           		})
           		.then(null, function (err) {
           			console.error(err);
           		});
     }

     studentService.addCourses = function(data)
     {
         console.log(data);
         return $http.post(host+"/newStudentCourses",data)
         .then(function(response){
             return response.data;
         })
         .then(null, function (err) {
             console.error(err);
         });
     };

	return studentService;
}]);
