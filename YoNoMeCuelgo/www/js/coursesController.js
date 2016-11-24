var app = angular.module("users")
.controller('coursesController',['$scope','$compile','$location','studentService', function($scope, $compile, $location, studentService) {

   $scope.start = 0;
   $scope.end = 1;
   $scope.currentPage=1;
   $scope.pageSize=2;
   $scope.currentPage2=1;
   $scope.pageSize2=2;

  //  var tutors = [{'name' : 'Tahiri Ciquitraque'}, {'name' : 'Nelson Triple A'}, {'name' : 'Israel La Bestia'}]
   //
   //
  //  $scope.courseList=[
  //   {'code' : 'ICOM5016', 'name' : 'Database Systems', 'tutors' : tutors,
  //    'arrowIcon':arrowLeftIcon
  //   },
  //   {'code' : 'ICOM4035', 'name' : 'Data Structures', 'tutors' : tutors,
  //    'arrowIcon':arrowLeftIcon
  //   },
  //   {'code' : 'ICOM4075', 'name' : 'Foundations of Computing', 'tutors' : tutors,
  //    'arrowIcon':arrowLeftIcon
  //   },
  //   {'code' : 'ICOM4009', 'name' : 'Software Engineering', 'tutors' : tutors,
  //    'arrowIcon':arrowLeftIcon
  //    }
  //  ];

   $scope.courseList = [];

   //Get Student Courses
   studentService.getStudentCourses(1)
   .then(function(response){
      var studentInfo;
      studentInfo = response;
      function getTutors(tutors){
          var tutorsToAdd = [];
          for(var i = 0; i < tutors.length; i++){
            tutorsToAdd.push({'first': tutors[i].userFirstName,
                              'last': tutors[i].userLastName,
                              'image': tutors[i].userImage
                            });
          }
          return tutorsToAdd;
       }

       for(var i = 0; i < studentInfo.length; i++){
         var object = {'code' : studentInfo[i].courseCode,
                       'name' : studentInfo[i].courseName,
                       'tutors': getTutors(studentInfo[i].tutors)
                      };
         $scope.courseList.push(object);
       }
   });

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
     console.log($scope.start+" "+$scope.end);
     return tutors;
   }

}]);
