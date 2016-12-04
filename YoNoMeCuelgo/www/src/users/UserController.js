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

    function getSettings(){
      // GET User Information
      var id;
      var email = firebase.auth().currentUser.email;
      if(email==='israel.figueroa1@upr.edu'){
        id=1;
        $scope.userRole='tutors'
        $scope.route('/tutors');
//        $route.reload();
      }
      else{
        id=2;
        $scope.userRole='student';
        $scope.route('/home');
//        $route.reload();
      }
      accountsService.getUsers()
          .then(function(response){

              assignUserInfo(response);

          });
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
            console.log(validated);
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



    //
    var imagePath = "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xtf1/v/t1.0-1/13912618_10154625059185827_4804033282118954744_n.jpg?oh=71c307466a6f3cf85ffc580d1a588c02&oe=58C703DB&__gda__=1485738904_e299d10033dcc5340dcf7c055ddfd831";
//    $scope.messages = [
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//        {
//          face : imagePath,
//          what: 'Brunch this weekend?',
//          who: 'Min Li Chan',
//          when: '3:08PM',
//          notes: " I'll be in your neighborhood doing errands"
//        },
//      ];
    //

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

//   $scope.courseList=[
//       {'id' :0,
//        'code' : 'ICOM5016',
//        'class': 'selectedButton'
//       },
//       {'id' :1,
//        'code' : 'ICOM4035',
//        'class': 'unselectedButton'
//       },
//       {'id' :2,
//        'code' : 'ICOM4075',
//        'class': 'unselectedButton'
//       },
//       {'id' :3,
//        'code' : 'ICOM4009',
//        'class': 'unselectedButton'
//        }
//      ];

   $scope.courseList = [];


   $scope.selectedCourse = $scope.courseList[0];

   $scope.currentCourses = [
        {'code' : 'ICOM5016','arrowIcon': arrowLeftIcon},
        {'code' : 'ICOM4035','arrowIcon': arrowLeftIcon}
   ]

   //$scope.newObject = {'code' : '','arrowIcon': arrowLeftIcon};

   function selectedItemChange(item) {
         //console.log(self.tempCourses);
         //console.log(item);
         //console.log(item.Code);
         $scope.isFire=true;
         $scope.item = item;
         $scope.tempCourses.push({'code': $scope.item.Code, 'arrowIcon': arrowLeftIcon});
         //$scope.currentCourses.push({'code': $scope.item.Code, 'arrowIcon': arrowLeftIcon});


         //console.log($scope.currentCourses);
   //      $scope.tempCourses.push(item);
        $timeout(function() {
            $scope.isb = false;
        });
   }

   function saveCourses() {
        var length = $scope.tempCourses.length;
        for (var i = 0; i < length; i++) {
            $scope.courseList.push($scope.tempCourses[i]);
            console.log($scope.tempCourses[i]);
            //POST AQUI SOBRE LOS CURSOS NUEVOS DEL TUTOR
        }

//        console.log(tempCourses);
//        console.log($scope.currentCourses);
//        console.log(self.tempCourses.length);
//        console.log(self.tempCourses[0]);
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
           console.log($scope.courseList);

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
        //console.log(courseToDelete);
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
//      var repos = [
//        {
//          'Code': 'ICOM4035',
//          'Title': 'Data Structures'
//        },
//        {
//          'Code': 'ICOM4075',
//          'Title': 'Foundations of Computing'
//        },
//        {
//          'Code': 'ICOM4015',
//          'Title': 'Advanced Programming'
//        },
//        {
//          'Code': 'ICOM4009',
//          'Title': 'Software Engineering'
//        },
//        {
//          'Code': 'MATE666',
//          'Title': 'Mate der Diablou'
//        }
//      ];
      var repos = [];
      for(var i = 0; i < courses.length; i++)
      {
        var object = {'Code': courses[i].courseCode,
                        'Title': courses[i].courseName}
        repos.push(object);
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
//        var data = JSON.parse($scope.tempCourses);
//        var index = data.map(function(d) { return d['Code']; }).indexOf(chip.Code);
        //console.log(self.tempCourses);
    }

    function requestInfo(ev) {
      console.log('requesting...')
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
      console.log(ev);
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
                                    $scope.userRole = 'student';
                                    $scope.statusMessage = student.userStatus;
                                    $scope.userName = student.userFirstName;
                                    $scope.lastName = student.userLastName;
                                    $scope.profilePicture = student.userImage;
                                    id = response[0].studentId;
                                })
                                .then(function(){
                                    studentService.getCountdown(id)
                                        .then(function(response2){
//                                            console.log(JSON.stringify(response2));

                                              if($scope.countdown.length>0){
                                                $timeout(location.reload());
                                              }
                                            $scope.countdown = response2[0].title;
                                            $scope.setDate(new Date(response2[0].time));
                                            $scope.saveCountdown();
                                        });
                                   studentService.getDirectMessages(id)
                                       .then(function(response){
                                           for(var i = 0; i < response.length; i++)
                                           {
                                               var object = {'userImage': response[i].userImage,
                                                               'title': response[i].title,
                                                               'userFirstName': response[i].userFirstName,
                                                               'userLastName': response[i].userLastName,
                                                               'body': response[i].body};

                                               $scope.messages.push(object);
                                           }

                                       });
                                    studentService.getGroupMessages(id)
                                      .then(function(response){

                                          $scope.groupMessages = [];
                                          for(var i = 0; i < response.length; i++)
                                          {
                                              var object = {'userImage': response[i].userImage,
                                                              'title': response[i].title,
                                                              'userFirstName': response[i].userFirstName,
                                                              'userLastName': response[i].userLastName,
                                                              'body': response[i].body};

                                              $scope.groupMessages.push(object);
                                          }

                                      });

                                });
                    }

                    else
                    {
                        $scope.userRole = 'tutors';
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

                                        function setAvailability(av)
                                        {
                                            if(av === 0)
                                                return 'Unavailable';
                                            else
                                                return 'Available';
                                        }

                                        for(var i = 0; i < response.length; i++)
                                        {
                                            var object = {'id': response[i].courseId,
                                                        'code': response[i].courseCode,
                                                        'name': response[i].courseName,
                                                        'availability': setAvailability(response[i].available)};
                                            $scope.courseList.push(object);
                                        }
                                    });

                                tutorsService.getDirectMessages($scope.tutorID)
                                    .then(function(response){
                                        console.log(JSON.stringify(response));
                                        for(var i = 0; i < response.length; i++)
                                        {
                                            var object = {'userImage': response[i].userImage,
                                                            'title': response[i].title,
                                                            'userFirstName': response[i].userFirstName,
                                                            'userLastName': response[i].userLastName,
                                                            'body': response[i].body};

                                            $scope.messages.push(object);
                                        }

                                    });

                            });
                    }
                }
            }
        }

        $scope.setCalendar = function(){
              $scope.showCalendar = true;
          }

          $scope.saveCountdown = function(){
              $scope.showName = false;
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

          $scope.exit = function(){
            swal({
              title: 'Are you sure?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, remove!'
            }).then(function () {
              swal(
                'Removed!',
                'You are no longer teaching the course.',
                'success'
              )
            })
          }


  }]);
