var app = angular.module("users")
.controller('adminController', ['accountsService', '$scope', '$compile', '$location', '$mdDialog', 'studentService', function(accountsService, $scope, $compile, $location, $mdDialog, studentService) {


    $scope.userList = [];

    function getAllUsers()
    {
        accountsService.getUsers()
               .then(function(response){

                    $scope.userList = response.map(function(user){
                            function getRole(isTutor)
                            {
                              if(isTutor === 1)
                              {
                                  return 'Tutor';
                              }
                              else
                                  return 'Student';
                            }

                            var object = {'userId': user.userId,
                                          'first': user.userFirstName,
                                          'last': user.userLastName,
                                          'image': user.userImage,
                                          'email': user.userEmail,
                                          'role':getRole(user.isTutor),
                                          'password': user.userPassword
                                         }

                            return object;

                    });

               });
    }




    $scope.del = function(user){
      swal({
        title: 'Permanently delete this user?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete User'
      }).then(function () {

        var userToDelete;

        if(user.role === 'Tutor')
        {
           userToDelete = {'userId': user.userId,
                           'isTutor': 1
                          }
        }

        else
        {
           userToDelete = {'userId': user.userId,
                           'isTutor': 0
                          }
        }

        console.log(JSON.stringify(userToDelete));
        var fbuser;

        firebase.auth().signInWithEmailAndPassword(user.email,user.password)
            .then(function(response){

            });
//        accountsService.deleteUser(userToDelete)
//              .then(function(){
//                swal(
//                  'Done!',
//                  'User has been completely removed from the app.',
//                  'success'
//                )
//              })
//              .then(null, function(err){
//                swal(
//                  'Sorry!',
//                  'This user remains... for now',
//                  'error'
//                )
//              });
      });
    }

    getAllUsers();

}]);
