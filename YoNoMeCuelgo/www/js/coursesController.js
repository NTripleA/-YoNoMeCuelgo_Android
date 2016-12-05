var app = angular.module("users")
.controller('coursesController',['$scope','$compile','$location','studentService', function($scope, $compile, $location, studentService) {

   $scope.start = 0;
   $scope.end = 1;
   $scope.currentPage=1;
   $scope.pageSize=2;
   $scope.currentPage2=1;
   $scope.pageSize2=2;


   $scope.courseList = [];

   //Get Student Courses
   $scope.sid;

   var email = firebase.auth().currentUser.email;

   studentService.getID(email)
          .then(function(response) {
               $scope.sid = response[0].studentId;
          })
          .then(function(){
               getStudentInfo($scope.sid);
          });

   function getStudentInfo(id)
   {
      studentService.getStudentCourses(id)
         .then(function(response){

             $scope.courseList = response.map(function(course){
                  var obj = {'code': course.courseCode,
                             'name': course.courseName,
                             'tutors': course.tutors.map(function(tutor){
                                              var tut = {'first': tutor.userFirstName,
                                                         'last': tutor.userLastName,
                                                         'image': tutor.userImage
                                                        }
                                              return tut;F
                                        })
                            }

                  return obj;
             });
         });

   }

   $scope.route = function(path){
       $location.path(path);
   }

   $scope.hasPrevious = function(){
     if($scope.start>0)
      return true;
     return false;
   }

   $scope.hasNext = function(){
     if($scope.end<$scope.availableTutors.length)
      return true;
     return false;
   }

   $scope.nextTutors = function(){
     if($scope.hasNext()){
       $scope.start = $scope.end;
       $scope.end++;
       if($scope.hasNext()){
         $scope.end++;
       }
     }
   }

   $scope.previousTutors = function(){
     if($scope.hasPrevious()){
       $scope.end = $scope.start;
       $scope.start=$scope.start-2;
     }
   }

   $scope.getAvailableTutors = function(tutors){
     $scope.availableTutors = tutors.slice();
     if (tutors.length == 0){
       return tutors;
     }
     if($scope.start==0){
       if(tutors.length>1){
         $scope.end=2;
       }
     }
     return tutors;
   }

   $scope.message = function(){
     swal({
       title: 'Contact Tutor.',
       input: 'text',
       showCancelButton: true,
       confirmButtonText: 'Send'
     }).then(function () {
       swal(
         'Sent!',
         'The tutor has been notified.',
         'success'
       )
     })
   }

   $scope.donate = function(sender){
    //  swal({
    //    title: 'Send gift card?',
    //    imageUrl: 'https://cdn.shopify.com/s/files/1/0662/0785/products/e38bd83af578077b65a31424bd24d085_1024x1024.png?v=1412203835',
    //    imageWidth: 400,
    //    imageHeight: 200,
    //    animation: false,
    //    showCancelButton: true,
    //    confirmButtonText: 'Yes'
    //  }).then(function () {
    //    swal(
    //      'Sent!',
    //      'The tutor will be greatful.',
    //      'success'
    //    )
    //  })
        var senderName = sender;
        var recipientName = 'Israel';
        var recipientPhone = '7875181788';
        var recipientEmail = 'israel.figueroa1@upr.edu';
        var demo = 'yifti';
        var production = 'yiftee';
        var page = 'http://app.'+demo+'.com/api/v1/gifts/send.html?api_token=1a461040ef067dea7f40fd8ef3b2663c4&sender_name='+senderName+'&recipient_name='+recipientName+'&recipient_email='+recipientEmail
        swal({
          html:'<iframe style="border: 0px; height:300px; " src="' + page + '" width="100%" height="100%"></iframe>',
          showCancelButton : true,
          showConfirmButton : false
        })
   }

//   getStudentInfo(1);

}]);
