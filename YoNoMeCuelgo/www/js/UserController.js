var app = angular.module("users")
    .controller('UserController',['userService', 'studentService', 'tutorsService','accountsService','$mdSidenav','$mdBottomSheet', '$timeout', '$log', '$scope', '$mdDialog', '$location', '$q', '$route', function(userService, studentService, tutorsService, accountsService, $mdSidenav, $mdBottomSheet, $timeout, $log, $scope, $mdDialog, $location, $q, $route)
    {

  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */

    $scope.currentPage=1;
    $scope.pageSize=3;
    var self = this;
    $scope.statusMessage = 'El ser humano es vago por naturaleza';
    self.loggedIn = false;
    self.selected     = null;
    var users = [ ];
    self.selectUser   = selectUser;
    self.toggleList   = toggleUsersList;
    self.makeContact  = makeContact;
    $scope.showCalendar=false;
    $scope.isFire=false;
    $scope.showName=false;
    self.courseList=[];
    $scope.countdown = "";
    $scope.userRole;

    function getSettings(){
        // GET User Information
        var id;
        var userRole;
        console.log(firebase.auth().currentUser);
        if(firebase.auth().currentUser != null)
        {
            accountsService.getUsers()
                .then(function(response){

                    userRole = assignUserInfo(response);
                })
                .then(function(){
                      if(userRole === 'tutors'){
                        id=1;
                        $scope.route('/tutors');
                  //        $route.reload();
                      }
                      else{

                        id=2;
                        $scope.route('/home');
                  //        $route.reload();
                      }

                });

        }
    }



      $scope.currentPath = function(){
        return $location.path();
      }

    $scope.route = function(path){
        $location.path(path);
    }


    $scope.isNavBarHide = function(){
        if($location.path().search('login')>-1){
            return true;
        }
        return false;
    }

    firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if(user.emailVerified){
      getSettings();
    }
    else{
      $scope.route('/verify');
    }
  }
  else {
    $scope.route('/login');
  }
});

    $scope.logIn = function(){
            var validated = true;
            var email = $scope.userEmail;
            var password = $scope.userPassword;
            if (typeof email === 'undefined' || !email) {
              swal("Please type an email", "", "warning");
              validated = false;
            }
            else if (typeof password === 'undefined' || !password) {
              swal("Please type a password", "", "warning");
              validated = false;
            }
            if(validated){
              $scope.loading=true;
              firebase.auth().signInWithEmailAndPassword(email, password)
              .then(function(onResolve){
                // $scope.route('home')
                $scope.loading=false;
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === 'auth/wrong-password') {
                  swal("Wrong Password", "", "error");
                } else {
                  swal(errorMessage, "", "error");
                }
                $scope.loading=false;
                $timeout($scope.$apply());
            });
          }
        }

        $scope.resend = function(){
          firebase.auth().currentUser.sendEmailVerification();
          swal('Verification email sent to: '+firebase.auth().currentUser.email, "", "success");
        }

        $scope.isUserVerified = function(){
          if(typeof(firebase.auth().currentUser) == 'undefined' || !firebase.auth().currentUser){
            return false;
          }
          return firebase.auth().currentUser.emailVerified;
        }

        $scope.signUp = function(){
          $scope.signFeedback="";
          if(typeof($scope.newEmail) != 'undefined' || $scope.newEmail){
            var domain = $scope.newEmail.split('@')[1];
            if(domain!='upr.edu'){
                swal('Type a upr student email. ¯\_(ツ)_/¯', "", "warning");
            }
            else{
              firebase.auth().createUserWithEmailAndPassword($scope.newEmail, $scope.newPassword)
              .then(function(onResolve){
                firebase.auth().currentUser.sendEmailVerification();
                swal('Verification email sent.', "", "success");
                $route.reload();
                //DO NOT DELETE FOLLOWING CODE
                swal.setDefaults({
                  title: 'Set Up your info.',
                  confirmButtonText: 'Next &rarr;',
                  showCancelButton: false,
                  animation: false,
                  progressSteps: ['1', '2', '3'],
                  allowOutsideClick: false,
                  allowEscapeKey: false
                })

                var steps = [
                  {
                    input:'text',
                    inputPlaceholder:'Your Name Here',
                    text: 'What is your name?'
                  },
                  {
                    input: 'checkbox',
                    inputValue: 0,
                    inputPlaceholder:'Check if you are a tutor.',
                  },
                  {
                    input: 'file',
                    inputAttributes: {
                      accept: 'image/*'
                    }
                  }
                ]

                swal.queue(steps).then(function (result) {
                  $scope.url = [];
                  var reader = new FileReader
                  reader.onload = function (e) {
                    $scope.url.push(e);
                    $scope.url.push(e.target.result);
                    $scope.settings= result.slice();
                    if($scope.url.length>1){
                        $scope.settings[2] = $scope.url[1];
                    }

                    swal({
                      imageUrl: e.target.result

                    })
                  }
                  reader.readAsDataURL(result[2]);
                  swal.resetDefaults()
                  swal({
                    title: 'All done!',
                    html:'Welcome: <h4>' + JSON.stringify(result) + '</h4>',
                    confirmButtonText: 'Lovely!',
                    showCancelButton: false
                  })
                }, function () {
                  swal.resetDefaults()
                })

                //
              }).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                swal(errorMessage, "", "error");
            });
            }
          }
          else{
            swal('Type a valid email.', "", "warning");
          }

        }

        $scope.logOut = function(){
          firebase.auth().signOut();
        }

        $scope.forgotPassword = function(){
          var email=$scope.userEmail;
          if(typeof email === 'undefined' || !email){
            swal('Please type your email.', "", "info");
          }
          else{
            firebase.auth().sendPasswordResetEmail(email)
            .then(function(onResolve){
              swal('Email with password recovery instruction sent.', "", "success");
            }).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              swal(errorMessage, "", "error");

          });
          }

        }



    userService
          .loadAllUsers()
          .then( function( users ) {
            self.users    = [].concat(users);
            self.selected = users[0];
          });

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('left').toggle();
    }

    $scope.toggleRightList = function(){
      $mdSidenav('right').toggle();
    }




    $scope.messages = [];

    /**
     * Select the current avatars
     * @param menuId
     */
    function selectUser ( user ) {
      self.selected = angular.isNumber(user) ? $scope.users[user] : user;
    }

    /**
     * Show the Contact view in the bottom sheet
     */
    function makeContact(selectedUser) {

        $mdBottomSheet.show({
          controllerAs  : "vm",
          templateUrl   : './src/users/view/contactSheet.html',
          controller    : [ '$mdBottomSheet', ContactSheetController],
          parent        : angular.element(document.getElementById('content'))
        }).then(function(clickedItem) {
          $log.debug( clickedItem.name + ' clicked!');
        });

        /**
         * User ContactSheet controller
         */
        function ContactSheetController( $mdBottomSheet ) {
          this.user = selectedUser;
          this.items = [
            { name: 'Phone'       , icon: 'phone'       , icon_url: 'assets/svg/phone.svg'},
            { name: 'Twitter'     , icon: 'twitter'     , icon_url: 'assets/svg/twitter.svg'},
            { name: 'Google+'     , icon: 'google_plus' , icon_url: 'assets/svg/google_plus.svg'},
            { name: 'Hangout'     , icon: 'hangouts'    , icon_url: 'assets/svg/hangouts.svg'}
          ];
          this.contactUser = function(action) {
            // The actually contact process has not been implemented...
            // so just hide the bottomSheet

            $mdBottomSheet.hide(action);
          };
        }
    }


   /* All of the following pertains to tutors*/

   var arrowDownIcon = "fa fa-chevron-down";
   var arrowLeftIcon = "fa fa-chevron-left";
   $scope.availability = "Available";
   self.deleteCourse = deleteCourse;

   $scope.status = '  ';
   $scope.customFullscreen = false;

   self.removeCourse = removeCourse;
   self.tempCourses = [];

   $scope.tempCourses = [];


   $scope.courseList = [];


   $scope.selectedCourse = $scope.courseList[0];

   $scope.currentCourses = [
        {'code' : 'ICOM5016','arrowIcon': arrowLeftIcon},
        {'code' : 'ICOM4035','arrowIcon': arrowLeftIcon}
   ]

   //$scope.newObject = {'code' : '','arrowIcon': arrowLeftIcon};

   function selectedItemChange(item) {
         $scope.isFire=true;
         $scope.item = item;
         $scope.tempCourses.push({'code': $scope.item.Code, 'arrowIcon': arrowLeftIcon});
         //$scope.currentCourses.push({'code': $scope.item.Code, 'arrowIcon': arrowLeftIcon});


   //      $scope.tempCourses.push(item);
        $timeout(function() {
            $scope.isb = false;
        });
   }

   function saveCourses() {
        var length = $scope.tempCourses.length;
        for (var i = 0; i < length; i++) {
            $scope.courseList.push($scope.tempCourses[i]);
            //POST AQUI SOBRE LOS CURSOS NUEVOS DEL TUTOR
        }

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

    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'addCourses.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
	  if (answer == 'Done') {
            saveCourses();
          }
          $scope.status = 'You said the information was "' + answer + '".';
          //console.log(self.tempCourses);
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };

  function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        if (answer==="useful"){
          swal(
            'Joined!',
            'Course(s) added.',
            'success'
          )
          $mdDialog.hide(answer);
        }
        else $mdDialog.hide(answer);
      };
    }


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
//      for(var i = 0; i < courses.length; i++)
//      {
//        var object = {'Code': courses[i].courseCode,
//                        'Title': courses[i].courseName}
//        repos.push(object);
//      }

      repos = courses.map(function(course){
          var object = {'Code': course.courseCode,
                        'Title': course.courseName}

          return object;

      });

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
//        var data = JSON.parse($scope.tempCourses);
//        var index = data.map(function(d) { return d['Code']; }).indexOf(chip.Code);
    }

    function requestInfo(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'info.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
         .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                  $scope.status = 'You cancelled the dialog.';
                });
      };

    $scope.showSignUp = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'signup.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
        })
         .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                  $scope.status = 'You cancelled the dialog.';
                });
      };


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


       /*Function to assign all user info*/
        function assignUserInfo(users)
        {
            var email = firebase.auth().currentUser.email;
            var userRole;

            if($location.path() === '/home' || $location.path() === '/tutors')
            {
                for(var i = 0; i < users.length; i++)
                {

                      if(users[i].userEmail === email)
                      {
                          if(users[i].isTutor === 0)
                          {
                              var student = users[i];
                              var id;

                              studentService.getStudentInfo(users[i].userId)
                                       .then(function(response){
                                             userRole = 'student';
                                             $scope.statusMessage = student.userStatus;
                                             $scope.userName = student.userFirstName;
                                             $scope.lastName = student.userLastName;
                                             $scope.profilePicture = student.userImage;
                                             $scope.countdownId = response[0].countdownId;
                                             id = response[0].studentId;
                                             $scope.uid = id;
                                       })
                                       .then(function(response){

                                              studentService.getCountdown(id)
                                                    .then(function(response2){
                                                        $scope.countdown = response2[0].title;
                                                        $scope.setDate(new Date(response2[0].time));
                                                        $scope.saveCountdown();
                                                    });
                                              studentService.getDirectMessages(id)
                                                   .then(function(response){

                                                       $scope.messages = response.map(function(message){
                                                                                          var obj = {'userImage': message.userImage,
                                                                                                     'title': message.title,
                                                                                                     'userFirstName': message.userFirstName,
                                                                                                     'userLastName': message.userLastName,
                                                                                                     'body': message.body
                                                                                                    }
                                                                                          return obj;

                                                                                      });

                                                   });
                                                studentService.getGroupMessages(id)
                                                  .then(function(response){

                                                      $scope.groupMessages = response.map(function(message){
                                                                                              var obj = {'userImage': message.userImage,
                                                                                                         'title': message.title,
                                                                                                         'userFirstName': message.userFirstName,
                                                                                                         'userLastName': message.userLastName,
                                                                                                         'body': message.body
                                                                                                        }
                                                                                              return obj;

                                                                                          });

                                                  });

                                       })
                          }

                          else
                          {
                              userRole = 'tutors';
                              $scope.statusMessage = users[i].userStatus;
                              $scope.profilePicture = users[i].userImage;
                              $scope.userName = users[i].userFirstName;
                              tutorsService.getTutorInfo(users[i].userId)
                                  .then(function(response){
                                      $scope.tutorID = response[0].tutorId;

                                  })
                                  .then(function(){
                                      tutorsService.getTutorCourses($scope.tutorID)
                                          .then(function(response){

                                              $scope.courseList = response.map(function(course){

                                                  function getAvailability(availability){
                                                      if(availability === 0)
                                                      {
                                                          return 'Unavailable'
                                                      }
                                                      else
                                                          return 'Available'
                                                   }

                                                  var obj = {'id': course.courseId,
                                                             'code': course.courseCode,
                                                             'name': course.courseName,
                                                             'availability': getAvailability(course.available)
                                                            }
                                                  return obj;

                                              });

                                          });

                                      tutorsService.getDirectMessages($scope.tutorID)
                                          .then(function(response){

                                              $scope.messages = response.map(function(message){
                                                    var obj = {'userImage': message.userImage,
                                                               'title': message.title,
                                                               'userFirstName': message.userFirstName,
                                                               'userLastName': message.userLastName,
                                                               'body': message.body
                                                              }
                                                    return obj;

                                              });

                                          });

                                  });



                              }

                              return userRole;
                      }


                }

            }
        }

        $scope.setCalendar = function(){
              $scope.showCalendar = true;
          }

          $scope.saveCountdown = function(){
              $scope.showName = false;
              $scope.newCountdown.newTitle = $scope.countdown;
              studentService.setCountdown($scope.newCountdown);
          }

          $scope.setDate = function(date){
              $scope.showCalendar=false;

              $scope.showName = true;
              //Format: Mon Oct 03 2016 00:00:00 GMT-0400 (AST)
              var month = date.getMonth()+1;
              var day = date.getDate();
              var year = date.getFullYear();
              var date = year.toString()+'/'+month.toString()+'/'+day.toString();

              $("#day")
                .countdown(date, function(event) {
                  $(this).text(
                    event.strftime('%D')
                  );
                });

                $("#hour")
                .countdown(date, function(event) {
                  $(this).text(
                    event.strftime('%H')
                  );
                });

                $("#min")
                .countdown(date, function(event) {
                  $(this).text(
                    event.strftime('%M')
                  );
                });

                $("#sec")
                .countdown(date, function(event) {
                  $(this).text(
                    event.strftime('%S')
                  );
                });


                //MAKE POST TO ENDPOINT HERE Params: title = $scope.countdown, time = date

                $scope.newCountdown = {'countdownId': $scope.countdownId,
                                    'newTime': year.toString()+'-'+month.toString()+'-'+day.toString(),
                                    'newTitle': $scope.countdown}

          }

          $scope.replyMessage = function(){
            swal({
              title: 'Reply',
              input: 'text',
              showCancelButton: true,
              confirmButtonText: 'Send'
            }).then(function () {
              swal(
                'Sent!',
                '',
                'success'
              )
            })
          }

          $scope.exit = function(tutorId,courseId){
            var data = {"courseId":courseId, "tutorId":tutorId}
            swal({
              title: 'Are you sure?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, remove!'
            }).then(function () {
              tutorsService.removeCourse(data).then(
                swal(
                  'Removed!',
                  'You are no longer teaching the course.',
                  'success'
                )
              )
              .then(null, function(err){
                swal(
                  'Sorry!',
                  'You have to teach this course forever... For now.',
                  'error'
                )
              })

            })
          }


  }]);
