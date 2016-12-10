var app = angular.module("users")
.controller('tutorsController',['$scope','$compile','studentService', 'accountsService', '$mdDialog', '$timeout', 'tutorsService', '$rootScope', function($scope, $compile,studentService, accountsService, $mdDialog, $timeout, tutorsService, $rootScope) {

  console.log("ESTO HA EMPEXADO")
  var self = this;

  $scope.exit = function(){
    swal({
      title: 'Are you sure?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, leave!'
    }).then(function () {
      swal(
        'Removed!',
        'You are no longer teaching the course.',
        'success'
      )
    })
  }

  $scope.messageReply = function(tutorId,studentName,studentId,userId){
   swal({
     title: 'Contact '+studentName,
     input: 'text',
     showCancelButton: true,
     inputValidator: function (value) {
       return new Promise(function (resolve, reject) {
         if (value) {
           resolve()
         } else {
           reject('You need to write something!')
         }
       })
     }
   }).then(function (result) {
     var data = {"message":"'"+result+"'","studentId":studentId,"tutorId":tutorId,"userId":userId}
     console.log(JSON.stringify(data));
     studentService.sendMessage(data).then(
       swal(
         'Sent!',
         'The student has been notified.',
         'success'
       )
     );
   });
 }

 //
 //   function that gets all the tutor courses

    function getTutCourses()
    {
        tutorsService.getTutorCourses($scope.tutorID)
            .then(function(response){

                function getAvailability(availability)
                {
                    if(availability === 0)
                    {
                        return 'Unavailable'
                    }
                    else
                        return 'Available'
                }
                $scope.courseList = response.map(function(course){
                    var obj = {'id': course.courseId,
                               'code': course.courseCode,
                               'name': course.courseName,
                               'availability': getAvailability(course.available)
                              }
                    return obj;

                });

            });

    }
    $scope.availability = "Available";
    self.deleteCourse = deleteCourse;

    $scope.status = '  ';
    $scope.customFullscreen = false;

    self.removeCourse = removeCourse;
    self.tempCourses = [];

    $rootScope.tempCourses = [];


    $scope.courseList = [];


    $scope.selectedCourse = $scope.courseList[0];



    function selectedItemChange(item) {
          $scope.isFire=true;
          $scope.item = item;
          $rootScope.tempCourses.push({'idc':$scope.item.Id, 'code': $scope.item.Code});
          console.log($rootScope.tempCourses);


         $timeout(function() {
             $scope.isFire = false;
         });
    }

    function saveCourses() {
 //        var length = $rootScope.tempCourses.length;
 //        for (var i = 0; i < length; i++) {
 //            $scope.courseList.push($rootScope.tempCourses[i]);
 //
 //            $rootScope.tempCourses
 //
 //
 //              //POST AQUI SOBRE LOS CURSOS NUEVOS DEL TUTOR
 //        }
         console.log("Before: "+$rootScope.tempCourses.length);



         var coursesToPost = $rootScope.tempCourses.map(function(course){
                 var object = {'tutorId': $scope.tutorID,
                               'courseId': course.idc}

                 return object;

         });


         $rootScope.tempCourses = [];

         tutorsService.addCourses(coursesToPost)
                        .then(function(){
                             getTutCourses();
                        });


 //
 //        while(tempCourses.length > 0)
 //        {
 //           $scope.currentCourses.push({'code': tempCourses[1], 'arrowIcon': arrowLeftIcon});
 //           self.tempCourses.splice(0,1);
 //           console.log($scope.currentCourses);
 //        }

      }

    function removeCourse() {
            $scope.courseList.splice(courseToDelete,1);
       }

     $scope.toggleCourse = function(teidx){
        var selected = idx;
        for(var i = 0; i < $scope.courseList.length; i++){
          if(i==selected){
            $scope.courseList[i].class = 'selectedButton';
            $scope.selectedCourse=$scope.courseList[i];
          }
          else{
            $scope.courseList[i].class = 'unselectedButton';
          }
        }
     }

     function deleteCourse(course){
         var index = $scope.courseList.indexOf(course);
         courseToDelete = index;
     }


     $scope.showConfirm = function(ev, course) {
         // Appending dialog to document.body to cover sidenav in docs app
         var confirm = $mdDialog.confirm()
               .title('Are you sure you want to delete this course?')
               .textContent('You can re-add the course later on.')
               .ariaLabel('Lucky day')
               .targetEvent(ev)
               .ok('Yes')
               .cancel('Cancel');

         $mdDialog.show(confirm).then(function() {
           $scope.status = 'You decided to get rid of your debt.';
           deleteCourse(course);
           removeCourse();
         }, function() {
           $scope.status = 'You decided to keep your debt.';
         });
       };

     $scope.showAdvanced = function(ev,courses) {
          console.log(courses)
         $mdDialog.show({
           controller: DialogController,
           templateUrl: 'addCourses.html',
           parent: angular.element(document.body),
           targetEvent: ev,
           clickOutsideToClose:false,
           fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
         })
         .then(function(answer) {
 	  if (answer === 'Done') {
 	          console.log("IM IN");
 	                     console.log(courses);

             swal(
                         'The tutoring begins!',
                         'Course(s) added.',
                         'success'
                       )
             saveCourses();
           }
           $scope.status = 'You said the information was "' + answer + '".';
         }, function() {
           $scope.status = 'You cancelled the dialog.';
         });
       };
//
//   function DialogController($scope, $mdDialog) {
//       $scope.hide = function() {
//         $mdDialog.hide();
//       };
//
//       $scope.cancel = function() {
//         $mdDialog.cancel();
//       };
//
//       $scope.answer = function(answer) {
//         if (answer==="Done"){
//                   console.log("HOLA: "+$rootScope.tempCourses)
//
//           swal(
//             'Joined!',
//             'Course(s) added.',
//             'success'
//           )
//           $mdDialog.hide(answer);
//         }
//         else $mdDialog.hide(answer);
//       };
//     }


 /* searchBarCtrl */



     self.simulateQuery = false;
     self.isDisabled    = false;

     /*Get all courses*/
     accountsService.allCourses()
         .then(function(response){

             self.repos = loadAll(response);

         });
 //    self.repos         = loadAll();
     self.querySearch   = querySearch;
     self.selectedItemChange = selectedItemChange;
     self.searchTextChange   = searchTextChange;
     self.removeChip = removeChip;

     //self.tempCourses=[];

     // ******************************
     // Internal methods
     // ******************************

     /**
      * Search for repos... use $timeout to simulate
      * remote dataservice call.
      */
     function querySearch (query) {
       var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
           deferred;
       if (self.simulateQuery) {
         deferred = $q.defer();
         $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
         return deferred.promise;
       } else {
         return results;
       }
     }

     function searchTextChange(text) {
     }



     /**
      * Build `components` list of key/value pairs
      */
     function loadAll(courses) {
       var repos = [];

       repos = courses.map(function(course){
              var object = {'Code': course.courseCode,
                           'Title': course.courseName,
                           'Id': course.courseId}
              return object;
       });

       for(var i = 0; i < repos.length; i++)
       {
          $scope.courseList.map(function(course){
               if(course.id === repos[i].Id)
                    repos.splice(i,1);
          });
       }

       return repos.map( function (repo) {
         repo.value = repo.Code.toLowerCase()+'-'+repo.Title.toLowerCase();
         return repo;
       });
     }

     /**
      * Create filter function for a query string
      */
     function createFilterFor(query) {
       var lowercaseQuery = angular.lowercase(query);

       return function filterFn(item) {
         return (item.value.indexOf(lowercaseQuery) != -1);
       };

     }

     //Contact chips implementation
     self.readonly = false;

     // Lists of fruit names and Vegetable objects
     self.roCourseNames = angular.copy(self.repos);
     self.editableCourseNames = angular.copy(self.repos);

     self.tags = [];

     self.newCourse = function(chip) {
       return {
         Code: chip.Code,
         Title: chip.Title
       };
     };



     function removeChip(chip) {
          console.log(chip);

           for(var i = 0; i < $rootScope.tempCourses.length; i++)
           {
              if($rootScope.tempCourses[i].idc === chip.Id)
              {
                  $rootScope.tempCourses.splice(i,1);
              }
           }


           console.log($rootScope.tempCourses);

     }



      function DialogController($scope, $mdDialog) {
          $scope.hide = function() {
            $mdDialog.hide();
          };

          $scope.cancel = function() {
            $mdDialog.cancel();
          };

          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };
        }

}]);
