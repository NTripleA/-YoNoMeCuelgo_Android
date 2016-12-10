var app = angular.module("users")
    .controller('UserController',['userService', 'studentService', 'tutorsService','accountsService','$mdSidenav','$mdBottomSheet', '$timeout', '$log', '$scope', '$mdDialog', '$location', '$q', '$route', function(userService, studentService, tutorsService, accountsService, $mdSidenav, $mdBottomSheet, $timeout, $log, $scope, $mdDialog, $location, $q, $route)
    {
      console.log("COntroller");
  /**
   * Main Controller for the Angular Material Starter App
   * @param $scope
   * @param $mdSidenav
   * @param avatarsService
   * @constructor
   */
   $scope.flag="Working...";
    $scope.authenticating = true;
    $scope.personalInfo = false;
    $scope.roleInfo = false;

    $scope.newuser = {'userFirstName' : '', 'userLastName' : '', 'userEmail' : '', 'userPassword' : '', 'isTutor' : '', 'userStatus' : ''}

    $scope.auth = function(newEmail, newPassword) {
      // $scope.authenticating = false;
      $scope.newuser.userEmail = newEmail;
      $scope.newuser.userPassword = newPassword;
      $scope.personalInfo = true;
    }

    $scope.info = function(newFirstName, newLastName) {
      // $scope.personalInfo = false;
      $scope.newuser.userFirstName = newFirstName;
      $scope.newuser.userLastName = newLastName;
      $scope.roleInfo = true;
    }

    $scope.role = function(newIsTutor, newStatus) {

      if (newIsTutor.toLowerCase()==="yes") {
        $scope.newuser.isTutor = 1;
      }
      else if (newIsTutor.toLowerCase()==="no"){
        $scope.newuser.isTutor = 0;
      }
      $scope.newuser.userStatus = newStatus;

      console.log($scope.newuser);

      $scope.signUp($scope.newuser);

      // $scope.personalInfo = false;
      // $scope.roleInfo = false;
      // $scope.authenticating = true;
    }

    $scope.currentPage=1;
    $scope.pageSize=3;
    $scope.coursesPageSize = 2;
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
        // var id;
        var userRole;
        console.log(firebase.auth().currentUser);
        if(firebase.auth().currentUser != null)
        {
          $scope.loading=true;
          var email = firebase.auth().currentUser.email;
          // var email = 'tahiri.fuentes@upr.edu';
          // email.email = $scope.userEmail;
          console.log(email);
            studentService.getID(email)
                .then(function(response){

                    console.log(JSON.stringify(response));
                    $scope.userId = response[0].userId;
                    var isTutor = response[0].isTutor;
                    if (isTutor==0){
                        //Get all info of the student
                        console.log($scope.userId);
                        studentService.getStudentInfo($scope.userId)
                                 .then(function(response){
                                      console.log(response);
                                       userRole = 'student';
                                       $scope.userRole = userRole;
                                       $scope.statusMessage = response[0].userStatus;
                                       $scope.userName = response[0].userFirstName;
                                       $scope.lastName = response[0].userLastName;
                                       $scope.profilePicture = response[0].userImage;
                                       id = response[0].studentId;
                                       $scope.uid = id; // Nel, Este es el id de estudiante, why 'uid'?
                                       $scope.studentId = id;
                                 })
                                 .then(function(){
                                   studentService.getStudentCourses($scope.studentId)
                                      .then(function(response){
                                          $scope.courseList = response.map(function(course){
                                               var obj = {'code': course.courseCode,
                                                          'name': course.courseName,
                                                          'tutors': course.tutors.map(function(tutor){
                                                                           var tut = {'first': tutor.userFirstName,
                                                                                      'last': tutor.userLastName,
                                                                                      'image': tutor.userImage,
                                                                                      'id':tutor.tutorId,
                                                                                      'email':tutor.userEmail
                                                                                     }
                                                                           return tut;F
                                                                     })
                                                         }

                                               return obj;
                                          });

                                      })
                                      .then(function(){
                                        studentService.getStudentGroups($scope.studentId)
                                               .then(function(response) {

                                               var groups = response;

                                                    $scope.myGroupsList = groups.map(function(group){
                                                                      var g = {'id': group.groupId,
                                                                                   'idc': group.courseId,
                                                                                   'name': group.groupName,
                                                                                   'size': group.groupSize,
                                                                                   'limit': group.groupCapacity,
                                                                                   'members': group.members.map(function(member){
                                                                                                                    var mem = {'first': member.userFirstName,
                                                                                                                               'last': member.userLastName,
                                                                                                                               'image': member.userImage
                                                                                                                              }
                                                                                                                    return mem;
                                                                                                                })
                                                                                  }
                                                                      return g;

                                                                });


                                               });
                                      });
                                 })
                                 .then(function(response){

                                        studentService.getCountdown(id)
                                              .then(function(response2){
                                                  $scope.countdown = response2[0].title;
                                                  $scope.setDate(new Date(response2[0].time));
                                                  // $scope.saveCountdown();
                                                  $scope.showName = false;
                                                  $scope.newCountdown.newTitle = $scope.countdown;
                                              });
                                        studentService.getDirectMessages($scope.userId)
                                             .then(function(response){

                                                 $scope.messages = response.reverse().map(function(message){
                                                                                    var obj = {'userImage': message.userImage,
                                                                                               'title': message.title,
                                                                                               'userFirstName': message.userFirstName,
                                                                                               'userLastName': message.userLastName,
                                                                                               'body': message.body,
                                                                                               'senderId':message.tutorId
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
                                              $scope.loading=false;
                                            });

                                 })
                        $scope.route('/home');
                    }

                    //If is tutor
                    else{
                      //
                      tutorsService.getTutorInfo($scope.userId)
                                            .then(function(response){
                                                userRole = 'tutors';
                                                $scope.userRole = userRole;
                                                $scope.statusMessage = response[0].userStatus;
                                                $scope.profilePicture = response[0].userImage;
                                                $scope.userName = response[0].userFirstName;
                                                $scope.tutorID = response[0].tutorId;

                                            })
                                            .then(function(){
                                                tutorsService.getTutorCourses($scope.tutorID)
                                                    .then(function(response){

                                                        $scope.courseList = response.map(function(course){
                                                            var obj = {'id': course.courseId,
                                                                       'code': course.courseCode,
                                                                       'name': course.courseName,
                                                                       'availability': function(){
                                                                                                    if(course.available === 0)
                                                                                                    {
                                                                                                        return 'Unavailable'
                                                                                                    }
                                                                                                    else
                                                                                                        return 'Available'
                                                                                                 }
                                                                      }
                                                            return obj;

                                                        });

                                                    });

                                                tutorsService.getDirectMessages($scope.userId)
                                                    .then(function(response){

                                                        $scope.messages = response.reverse().map(function(message){
                                                              var obj = {'userImage': message.userImage,
                                                                         'title': message.title,
                                                                         'userFirstName': message.userFirstName,
                                                                         'userLastName': message.userLastName,
                                                                         'body': message.body,
                                                                         'senderId':message.studentId
                                                                        }
                                                              return obj;

                                                        });
                                                        $scope.loading=false;
                                                    });

                                            });
                      $scope.route('/tutors');
                    }

                    // userRole = assignUserInfo(response);
                });
                // .then(function(userRole){
                //     console.log(userRole);
                //       if(userRole === 'tutors'){
                //         // id=1;
                //         console.log('going to tutors');
                //         $scope.route('/tutors');
                //   //        $route.reload();
                //       }
                //       else{
                //
                //         // id=2;
                //         console.log('going home');
                //         $scope.route('/home');
                //   //        $route.reload();
                //       }
                //
                // });

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

    $scope.logIn = function(email,password){
        console.log("");
            var validated = true;
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

        $scope.signUp = function(newUser){
          $scope.signFeedback="";
          if(typeof(newUser.userEmail) != 'undefined' || newUser.userEmail){
            var domain = newUser.userEmail.split('@')[1];
            if(domain!='upr.edu'){
                swal('Type a upr student email. ¯\_(ツ)_/¯', "", "warning");
            }
            else{
              console.log("funcionaaaaaaa");
              firebase.auth().createUserWithEmailAndPassword(newUser.userEmail, newUser.userPassword)
               .then(function(onResolve){
                 firebase.auth().currentUser.sendEmailVerification();
                 swal('Verification email sent.', "", "success");
                //  $route.reload();
                 accountsService.newUser(newUser);
               })

                //DO NOT DELETE FOLLOWING CODE
                // swal.setDefaults({
                //   title: 'Set Up your info.',
                //   confirmButtonText: 'Next &rarr;',
                //   showCancelButton: false,
                //   animation: false,
                //   progressSteps: ['1', '2', '3', '4'],
                //   allowOutsideClick: false,
                //   allowEscapeKey: false
                // })
                //
                // var steps = [
                //   {
                //     input:'text',
                //     inputPlaceholder:'Your Name Here',
                //     text: 'What is your firstname?'
                //   },
                //   {
                //     input:'text',
                //     inputPlaceholder:'Your Lastname Here',
                //     text:'What is your lastname?'
                //   },
                //   {
                //     input: 'checkbox',
                //     inputValue: 0,
                //     inputPlaceholder:'Are you a tutor?',
                //   },
                //   {
                //     input: 'file',
                //     inputAttributes: {
                //       accept: 'image/*'
                //     }
                //   }
                // ]

                // swal.queue(steps).then(function (result) {
                //   $scope.url = [];
                //   var reader = new FileReader
                //   reader.onload = function (e) {
                //     $scope.url.push(e);
                //     $scope.url.push(e.target.result);
                //     $scope.settings= result.slice();
                //     if($scope.url.length>1){
                //         $scope.settings[2] = $scope.url[1];
                //     }
                //
                //     swal({
                //       imageUrl: e.target.result
                //
                //     })
                //   }
                //   reader.readAsDataURL(result[2]);
                //   swal.resetDefaults()
                //   swal({
                //     title: 'All done!',
                //     html:'Welcome: <h4>' + JSON.stringify(result) + '</h4>',
                //     confirmButtonText: 'Lovely!',
                //     showCancelButton: false
                //   })
                // }, function () {
                //   swal.resetDefaults()
                // })

                //
            //   }).catch(function(error) {
            //     // Handle Errors here.
            //     var errorCode = error.code;
            //     var errorMessage = error.message;
            //     swal(errorMessage, "", "error");
            // });
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
      console.log("side bar");
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

    $scope.changeSettings = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'changeSettings.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
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
//    accountsService.allCourses()
//        .then(function(response){
//
//            self.repos = loadAll(response);
//
//        });
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
            // var email = firebase.auth().currentUser.email;
            // var userRole;
            //
            // if($location.path() === '/home' || $location.path() === '/tutors')
            // {
            //     for(var i = 0; i < users.length; i++)
            //     {
            //
            //           if(users[i].userEmail === email)
            //           {
            //               if(users[i].isTutor === 0)
            //               {
            //                   var student = users[i];
            //                   var id;
            //
            //
                              // studentService.getStudentInfo(users[i].userId)
                              //          .then(function(response){
                              //                userRole = 'student';
                              //                $scope.statusMessage = student.userStatus;
                              //                $scope.userName = student.userFirstName;
                              //                $scope.lastName = student.userLastName;
                              //                $scope.profilePicture = student.userImage;
                              //                $scope.countdownId = response[0].countdownId;
                              //                id = response[0].studentId;
                              //                $scope.uid = id; // Nel, Este es el id de estudiante, why 'uid'?
                              //                $scope.userId = response[0].userId // Este es el userId - Israel
                              //          })
                              //          .then(function(response){
                              //
                              //                 studentService.getCountdown(id)
                              //                       .then(function(response2){
                              //                           $scope.countdown = response2[0].title;
                              //                           $scope.setDate(new Date(response2[0].time));
                              //                           $scope.saveCountdown();
                              //                       });
                              //                 studentService.getDirectMessages(id)
                              //                      .then(function(response){
                              //
                              //                          $scope.messages = response.map(function(message){
                              //                                                             var obj = {'userImage': message.userImage,
                              //                                                                        'title': message.title,
                              //                                                                        'userFirstName': message.userFirstName,
                              //                                                                        'userLastName': message.userLastName,
                              //                                                                        'body': message.body
                              //                                                                       }
                              //                                                             return obj;
                              //
                              //                                                         });
                              //
                              //                      });
                              //                   studentService.getGroupMessages(id)
                              //                     .then(function(response){
                              //
                              //                         $scope.groupMessages = response.map(function(message){
                              //                                                                 var obj = {'userImage': message.userImage,
                              //                                                                            'title': message.title,
                              //                                                                            'userFirstName': message.userFirstName,
                              //                                                                            'userLastName': message.userLastName,
                              //                                                                            'body': message.body
                              //                                                                           }
                              //                                                                 return obj;
                              //
                              //                                                             });
                              //
                              //                     });
                              //
                              //          })
            //               }
            //
            //               else
            //               {
                              // userRole = 'tutors';
                              // $scope.statusMessage = users[i].userStatus;
                              // $scope.profilePicture = users[i].userImage;
                              // $scope.userName = users[i].userFirstName;
            //                   tutorsService.getTutorInfo(users[i].userId)
            //                       .then(function(response){
            //                           $scope.tutorID = response[0].tutorId;
            //
            //                       })
            //                       .then(function(){
            //                           tutorsService.getTutorCourses($scope.tutorID)
            //                               .then(function(response){
            //
            //                                   $scope.courseList = response.map(function(course){
            //                                       var obj = {'id': course.courseId,
            //                                                  'code': course.courseCode,
            //                                                  'name': course.courseName,
            //                                                  'availability': function(){
            //                                                                               if(course.available === 0)
            //                                                                               {
            //                                                                                   return 'Unavailable'
            //                                                                               }
            //                                                                               else
            //                                                                                   return 'Available'
            //                                                                            }
            //                                                 }
            //                                       return obj;
            //
            //                                   });
            //
            //                               });
            //
            //                           tutorsService.getDirectMessages($scope.tutorID)
            //                               .then(function(response){
            //
            //                                   $scope.messages = response.map(function(message){
            //                                         var obj = {'userImage': message.userImage,
            //                                                    'title': message.title,
            //                                                    'userFirstName': message.userFirstName,
            //                                                    'userLastName': message.userLastName,
            //                                                    'body': message.body
            //                                                   }
            //                                         return obj;
            //
            //                                   });
            //
            //                               });
            //
            //                       });
            //
            //
            //
            //                   }
            //
            //                   return userRole;
            //           }
            //
            //
            //     }
            //
            // }
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

                $scope.newCountdown = {'studentId': $scope.studentId,
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

              // swal(
              //   'Sent!',
              //   '',
              //   'success'
              // )
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

          $scope.updateAvailability = function(tutorId,courseId,availability){
            var data = {"courseId":courseId, "tutorId":tutorId, "availability":availability}
            swal({
              title: 'Are you sure you want to change your availability?',
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, update!'
            }).then(function () {
              tutorsService.updateAvailability(data).then(
                swal(
                  'Updated!',
                  'Nobody knows that you are teaching this course.',
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
          //PUSHHHHH
          setTimeout(function(){
            var push = PushNotification.init({
                   android: {
                       senderID: "552117664338",
                       vibrate: "true",
                       sound: 'true'
                   },
                   browser: {
                       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
                   },
                   windows: {}
                   });
                   push.on('registration', function(data) {
                  console.log(data.registrationId);
                  // alert('registered');
                  });

                  push.on('notification', function(data) {
                    console.log(data);
                    // storeNotification(response);
                    // push.rx.notification()
                    // .subscribe((data) => {
                    //   alert('hey' + ': ' + 'hey');
                    // });
                  });
              }, 5000);
          //
          $scope.sendMessage = function(tutorId,tutorName,studentId,userId){
           swal({
             title: 'Contact '+tutorName,
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
                 'The tutor has been notified.',
                 'success'
               )
             );
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
  }]);
