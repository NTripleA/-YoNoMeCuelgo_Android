var app = angular.module("users")
.controller('groupController', ['studentService', '$scope', '$compile', '$location', '$rootScope', '$mdDialog', function(studentService, $scope, $compile, $location, $rootScope, $mdDialog) {

    var arrowDownIcon = "fa fa-chevron-down"
    var arrowLeftIcon = "fa fa-chevron-left"
    var members = [];

    $scope.currentPage = 1;
    $scope.pageSize = 2;
    self.courseList = [];
    self.studentId = null;

//    var members = [{'name' : 'Tahiri Ciquitraque'}, {'name' : 'Nelson Triple A'}, {'name' : 'Israel La Bestia'}]


  if($location.path() === '/groups'){
    var email = firebase.auth().currentUser.email;

    studentService.getID(email)
          .then(function(response){

                $scope.sid = response[0].studentId;
                self.studentId = $scope.sid;
                console.log(self.studentId);
                getGroupInfo();
          });
    }
    function getGroupInfo()
    {

              console.log("get student courses for: "+$scope.sid);
              studentService.getStudentCourses($scope.sid)
                                  .then(function(response){

                                      var courses = response;

                                      $scope.courseList = courses.map(function(course){
                                            var obj = {'idc': course.courseId,
                                                       'code': course.courseCode,
                                                       'title': course.courseName
                                                      }
                                            return obj;

                                      });
                                      self.courseList = $scope.courseList;

                                  });


      studentService.getStudentGroups($scope.sid)
             .then(function(response) {
              $scope.groupFlag = response.slice();
             var groups = response.slice();

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


             })
             .then(function(){
               studentService.getOtherGroups($scope.sid)
                    .then(function(response3) {
                    var allGroups = response3;
                        $scope.groupList = allGroups.map(function(group){
                                var obj = {'id': group.groupsId,
                                           'idc': group.courseId,
                                           'name': group.groupName,
                                           'size': group.groupSize,
                                           'limit': group.groupCapacity,
                                          }
                                return obj;
                        });



                    });





             });

    }





    var groupInfo = [];
    $scope.myGroupsList = [];


    self.selectedItems = [];
    self.items = [];
    var list = [];
    $scope.submit = false;
    var submit = false;
    self.newObject = {'groupName' : '', 'groupCapacity' : '', 'courseId' : '', 'studentId' : $scope.sid};
    var nameSet = false;
    var limitSet = false;
    var courseSet = false;
    self.createGroup = false;

    $scope.toggleGroups = function(i){
        if ($scope.myGroupsList[i].arrowIcon.search(arrowDownIcon)>-1){
            $scope.myGroupsList[i].arrowIcon = arrowLeftIcon;
        }
        else
            $scope.myGroupsList[i].arrowIcon = arrowDownIcon;
    }

    $scope.courseGroups = function (selectedCourse){
        var selected = 0;
        var length = $scope.courseList.length;
        var items = [];
        var length2 = $scope.groupList.length;

        for (var i = 0; i < length; i++) {
            var selection = selectedCourse.split("-");
            var temp = selection[0].split(" ");
            var string = temp[1];
            if($scope.courseList[i].code == string) {
                selected = $scope.courseList[i].idc;
                break;
            }
        }

        for (var j = 0; j < length2; j++) {
            if ($scope.groupList[j].idc == selected) {
                items.push($scope.groupList[j]);
            }
        }

        console.log(self.items);
        $scope.items = items;
    }

    $scope.toggle = function (item, list) {
      var idx = self.selectedItems.indexOf(item);
      if (idx > -1) {
        self.selectedItems.splice(idx, 1);
      }
      else {
        //list.push(item);
        self.selectedItems.push(item);
      }
    }

    $scope.exists = function (item, list) {
      return self.selectedItems.indexOf(item) > -1;
    }

    $scope.submitGroup = function(){
      console.log("");
        // submit = true;
        // for (var i = 0; i < $scope.selectedItems.length; i++){
        //     var objectList = $scope.myGroupsList;
        //     var length3 = objectList.length;
        //     var object = $scope.myGroupsList[length3-1];
        //     $scope.selectedItems[i].id = object.id + 1;
        //     $scope.myGroupsList.push($scope.selectedItems[i]);
        // }
        // //$location.path('#/groups');
        // if ($scope.createGroup == true) {
        //     objectList = $scope.myGroupsList;
        //     length4 = objectList.length;
        //     object = $scope.myGroupsList[length4-1];
        //     $scope.newObject.id = object.id + 1;
        //     $scope.myGroupsList.push($scope.newObject);
        // }
    }

    $scope.saveGroup = function(tempGroups) {
        for(i = 0; i < tempGroups; i++){
        }
    }

    $scope.removeGroup = function(group) {
        var index = $scope.myGroupsList.indexOf(group);
        $scope.myGroupsList.splice(index,1);
    }

    self.removeGroup = $scope.removeGroup;
    self.submitGroup = $scope.submitGroup;

    $scope.update = function(data, key) {
        if (key == 'name') {
          self.newObject.groupName = "\'" + data + "\'";
          console.log(self.newObject);
          nameSet = true;
        }
        else if (key == 'limit') {
          self.newObject.groupCapacity = data;
          console.log(self.newObject);
          limitSet = true
        }
        else if (key == 'course') {
          var d = data.split("-");
          var d1 = d[0].split(" ").join();
          var d2 = d1.replace(",", "");
          // console.log(d2);
          var id = 0;
          self.courseList.map(function(course){
            if (course.code == d2){
              // console.log(course.idc);
              id = course.idc;
            }
          })
          // console.log(id);
          self.newObject.courseId = id;
          // console.log(self.newObject);
          courseSet = true;
        }
        if (nameSet == true && limitSet == true && courseSet == true) {
            self.createGroup = true;
            self.newObject.studentId = $scope.sid;
        }
    }

    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'tabDialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false
        })
         .then(function(answer) {
                  $scope.status = 'You said the information was "' + answer + '".';
                  submitGroup();
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

         $scope.answer = function(answer,items) {
           if (answer==="useful"){
             $scope.createGroup = self.createGroup;

             console.log($scope.sid);

             if ($scope.createGroup && (self.selectedItems.length==0)) {
                $scope.newObject = self.newObject;
                console.log($scope.newObject);

                studentService.newGroup($scope.newObject).then(function(response) {
                  swal(
                    'Joined!',
                    'Group(s) added.',
                    'success'
                  )
                }).then(null,function(error){
                     swal(
                       'Sorry',
                       'You have no access to this group.. For now',
                       'error'
                     )
                 })
             }

             else if ((self.selectedItems.length >= 1) && !$scope.createGroup) {
               $scope.items = {'studentId' : null, 'groups' : self.selectedItems};
               console.log(self.studentId);
               $scope.items.studentId = self.studentId;
               // $scope.items.push(self.selectedItems);
               console.log($scope.items);

               studentService.joinGroup($scope.items)
               .then(
                 swal(
                   'Joined!',
                   'Group(s) added.',
                   'success'
                 )
               ).then(null, function(error){
                 swal(
                   'Sorry',
                   'You have no access to this group... For now',
                   'error'
                 )
               })
             }

            else if ((self.selectedItems.length >= 1) && $scope.createGroup){
               $scope.newObject = self.newObject;
               console.log($scope.newObject);

               studentService.newGroup($scope.newObject).then(function(response) {
                 $scope.items = {'studentId' : null, 'groups' : self.selectedItems};
                 console.log($scope.newObject.studentId);
                 $scope.items.studentId = $scope.newObject.studentId;
                 // $scope.items.push(self.selectedItems);
                 console.log($scope.items);

                 studentService.joinGroup($scope.items).then(
                     swal(
                       'Joined!',
                       'Group(s) added.',
                       'success'
                     )
                   ).then(null, function(error){
                     swal(
                       'Sorry',
                       'You have no access to this group... For now',
                       'error'
                     )
                   })
                })
             }

             $mdDialog.hide(answer);
           }
           else $mdDialog.hide(answer);
         };
       }

    $scope.message = function(){
      swal({
        title: 'Group Post',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Send'
      }).then(function () {
        swal(
          'Sent!',
          'Your group has been notified.',
          'success'
        )
      })
    }

    $scope.exit = function(group){
      console.log(group);
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave!'
      }).then(function () {
        var groupToLeave = {"studentId": $scope.sid,
                            "groupsId": group.id};

        studentService.leaveGroup(groupToLeave)
              .then(function(){
                swal(
                  'Removed!',
                  'You are no longer in the group.',
                  'success'
                )
                getGroupInfo();
              })
              .then(null, function(err){
                swal(
                  'Sorry!',
                  'You are stuck in this group... For now',
                  'error'
                )
              })
      })
    }

}]);
