var app = angular.module("users")
.controller('tutorsController', function($scope, $compile) {

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

});
