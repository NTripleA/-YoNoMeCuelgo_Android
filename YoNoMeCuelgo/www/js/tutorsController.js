var app = angular.module("users")
.controller('tutorsController',['$scope','$compile','studentService', 'accountsService', '$mdDialog', '$timeout', 'tutorsService', '$rootScope', 'accountsService', function($scope, $compile,studentService, accountsService, $mdDialog, $timeout, tutorsService, $rootScope, accountsService) {

  var self = this;
  $scope.tutorID;


  $scope.$on('tid', function(event, response){
      $scope.tutorID = response.tid;
//      getTutCourses();
//       tutorsService.otherCourses($scope.tutorID)
//               .then(function(response){
//
//                   $scope.repos = loadAll(response);
//                   console.log($scope.repos);
//
//               });

  });



  $scope.test = function(id)
  {
      $scope.tutorID = id;
  }

  $scope.exit = function(tutorId,courseId){
              var data = {"courseId":courseId, "tutorId":tutorId}
              swal({
                title: 'Are you sure?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, remove!'
              }).then(function () {
                tutorsService.removeCourse(data).then(function(){
                  swal(
                    'Removed!',
                    'You are no longer teaching the course.',
                    'success'
                  )

                  getTutCourses();
                })
                .then(null, function(err){
                  swal(
                    'Sorry!',
                    'You have to teach this course forever... For now.',
                    'error'
                  )
                })

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
//
//    function getTutCourses()
//    {
//        tutorsService.getTutorCourses($scope.tutorID)
//            .then(function(response){
//
//                function getAvailability(availability)
//                {
//                    if(availability === 0)
//                    {
//                        return 'Unavailable'
//                    }
//                    else
//                        return 'Available'
//                }
//                $scope.courseList = response.map(function(course){
//                    var obj = {'id': course.courseId,
//                               'code': course.courseCode,
//                               'name': course.courseName,
//                               'availability': getAvailability(course.available)
//                              }
//                    return obj;
//
//                });
//
//
//            });
//
//    }
//    $scope.availability = "Available";
//    self.deleteCourse = deleteCourse;
//
//    $scope.status = '  ';
//    $scope.customFullscreen = false;
//
    self.removeCourse = removeCourse;
//    self.tempCourses = [];
//
//    $rootScope.tempCourses = [];
//
//
//    $scope.courseList = [];
//
//
//    $scope.selectedCourse = $scope.courseList[0];
//
//
//
//    function selectedItemChange(item) {
//          $scope.isFire=true;
//          $scope.item = item;
//          $rootScope.tempCourses.push({'idc':$scope.item.Id, 'code': $scope.item.Code});
//
//
//         $timeout(function() {
//             $scope.isFire = false;
//         });
//    }
//
//    function saveCourses() {
//
//
//
//         var coursesToPost = $rootScope.tempCourses.map(function(course){
//                 var object = {'tutorId': $scope.tutorID,
//                               'courseId': course.idc}
//
//                 return object;
//
//         });
//
//
//         $rootScope.tempCourses = [];
//
//         tutorsService.addCourses(coursesToPost)
//                        .then(function(){
//                             getTutCourses();
//                        });
//
//
//
//      }
//
    function removeCourse() {
            $scope.courseList.splice(courseToDelete,1);
       }

     $scope.toggleCourse = function(idx){
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
//
     function deleteCourse(course){
         var index = $scope.courseList.indexOf(course);
         courseToDelete = index;
     }
//
//
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
//
//     $scope.showAdvanced = function(ev,courses) {
//         $mdDialog.show({
//           controller: DialogController,
//           templateUrl: 'addCourses.html',
//           parent: angular.element(document.body),
//           targetEvent: ev,
//           clickOutsideToClose:false,
//           fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
//         })
//         .then(function(answer) {
// 	        if (answer === 'Done') {
//
// 	          swal({
//                  title: 'Are you sure you want to tutor these courses?',
//                  type: 'warning',
//                  showCancelButton: true,
//                  confirmButtonText: 'Yes, leave!'
//                }).then(function () {
//                   swal(
//                         'The tutoring begins!',
//                         'Course(s) added.',
//                         'success'
//                       )
//                   saveCourses();
//                })
//
//           }
//           else{
//                swal({
//                      title: 'Are you sure you want to cancel?',
//                      type: 'warning',
//                      showCancelButton: true,
//                      confirmButtonText: 'Yes, leave!'
//                    }).then(function () {
//                       swal(
//                             'You just cancelled!',
//                             'Course(s) NOT added. You can add them later on.',
//                             'error'
//                           )
//                       $rootScope.tempCourses.length = 0;
//                    })
//
//           }
//           $scope.status = 'You said the information was "' + answer + '".';
//         }, function() {
//           $scope.status = 'You cancelled the dialog.';
//         });
//       };
////
////   function DialogController($scope, $mdDialog) {
////       $scope.hide = function() {
////         $mdDialog.hide();
////       };
////
////       $scope.cancel = function() {
////         $mdDialog.cancel();
////       };
////
////       $scope.answer = function(answer) {
////         if (answer==="Done"){
////                   console.log("HOLA: "+$rootScope.tempCourses)
////
////           swal(
////             'Joined!',
////             'Course(s) added.',
////             'success'
////           )
////           $mdDialog.hide(answer);
////         }
////         else $mdDialog.hide(answer);
////       };
////     }
//
//
// /* searchBarCtrl */
//
//
//
//     self.simulateQuery = false;
//     self.isDisabled    = false;
//
//     /*Get all courses*/
//
////       while(typeof($scope.repos) === 'undefined' || !$scope.repos){
////       console.log('algo');}
//
//
////                 accountsService.allCourses()
////                         .then(function(response){
////
////                             $scope.repos = loadAll(response);
////
////                         });
//
//     tutorsService.otherCourses($scope.tutorID)
//                   .then(function(response){
//
//                       $scope.repos = loadAll(response);
//                       console.log($scope.repos);
//
//                   });
//
//
// //    self.repos         = loadAll();
//     self.querySearch   = querySearch;
//     self.selectedItemChange = selectedItemChange;
//     self.searchTextChange   = searchTextChange;
//     self.removeChip = removeChip;
//
//     //self.tempCourses=[];
//
//     // ******************************
//     // Internal methods
//     // ******************************
//
//     /**
//      * Search for repos... use $timeout to simulate
//      * remote dataservice call.
//      */
//     function querySearch (query) {
//       var results = query ? $scope.repos.filter( createFilterFor(query) ) : $scope.repos,
//           deferred;
//       if (self.simulateQuery) {
//         deferred = $q.defer();
//         $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
//         return deferred.promise;
//       } else {
//         return results;
//       }
//     }
//
//     function searchTextChange(text) {
//     }
//
//
//
//     /**
//      * Build `components` list of key/value pairs
//      */
//     function loadAll(courses) {
//       var repos = [];
//
//       repos = courses.map(function(course){
//              var object = {'Code': course.courseCode,
//                           'Title': course.courseName,
//                           'Id': course.courseId}
//              return object;
//       });
//
//
//
//       return repos.map( function (repo) {
//         repo.value = repo.Code.toLowerCase()+'-'+repo.Title.toLowerCase();
//         return repo;
//       });
//     }
//
//     /**
//      * Create filter function for a query string
//      */
//     function createFilterFor(query) {
//       var lowercaseQuery = angular.lowercase(query);
//
//       return function filterFn(item) {
//         return (item.value.indexOf(lowercaseQuery) != -1);
//       };
//
//     }
//
//     //Contact chips implementation
//     self.readonly = false;
//
//     // Lists of fruit names and Vegetable objects
//     self.roCourseNames = angular.copy($scope.repos);
//     self.editableCourseNames = angular.copy($scope.repos);
//
//     self.tags = [];
//
//     self.newCourse = function(chip) {
//       return {
//         Code: chip.Code,
//         Title: chip.Title,
//         Id: chip.Id
//       };
//     };
//
//
//
//     function removeChip(chip) {
//
//           for(var i = 0; i < $rootScope.tempCourses.length; i++)
//           {
//              if($rootScope.tempCourses[i].idc === chip.Id)
//              {
//                  $rootScope.tempCourses.splice(i,1);
//              }
//           }
//
//
//
//     }
//
//
//
//      function DialogController($scope, $mdDialog) {
//          $scope.hide = function() {
//            $mdDialog.hide();
//          };
//
//          $scope.cancel = function() {
//            $mdDialog.cancel();
//          };
//
//          $scope.answer = function(answer) {
//            $mdDialog.hide(answer);
//          };
//        }


}]);
