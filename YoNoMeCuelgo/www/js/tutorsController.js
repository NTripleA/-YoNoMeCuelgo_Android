var app = angular.module("users")
.controller('tutorsController',['$scope','$compile','studentService', function($scope, $compile,studentService) {

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
   })
 }

}]);
