var app = angular.module("users")
.controller('groupController', ['studentService', '$scope', '$compile', '$location', '$rootScope', '$mdDialog', function(studentService, $scope, $compile, $location, $rootScope, $mdDialog) {

    var arrowDownIcon = "fa fa-chevron-down"
    var arrowLeftIcon = "fa fa-chevron-left"
    var members = [];

    $scope.currentPage = 1;
    $scope.pageSize = 2;
    $scope.sid;

//    var members = [{'name' : 'Tahiri Ciquitraque'}, {'name' : 'Nelson Triple A'}, {'name' : 'Israel La Bestia'}]



    var email = firebase.auth().currentUser.email;

    studentService.getID(email)
          .then(function(response){
                $scope.sid = response[0].studentId;
                getGroupInfo();
          });

    function getGroupInfo()
    {
        if($location.path() === '/groups')
          {
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

                                  });
          }

      studentService.getStudentGroups($scope.sid)
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


             })
             .then(function(){
               studentService.getAllGroups()
                    .then(function(response3) {

                    var allGroups = response3;
                    /*list of groups that the user is NOT part of */

                      /*verifies if the group is already on the personal groupList*/
//                          function groupExist(group)
//
                        function isStudentCourse()
                        {
                             return $scope.myGroupsList.some(function(group){
                                     return group.groupsId === group.id;
                             });
                        }

                        for(var i = 0; i < allGroups.length; i++)
                        {
                            $scope.myGroupsList.map(function(group)
                            {
                                //If group id = a group id of a group the user is already in, if the group is full
                                //or the group is not part of the
                                if(group.id === allGroups[i].groupsId || group.groupSize === group.groupCapacity)
                                {
                                    allGroups.splice(i,1);
                                }

                            });
                        }

                        allGroups.filter(isStudentCourse);

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


    $scope.selectedItems = [];
    $scope.items = [];
    var list = [];
    $scope.submit = false;
    var submit = false;
    $scope.newObject = {'id' : '', 'idc' : '1', 'members' : members, 'name' : '', 'size' : '3', 'limit' : '', 'arrowIcon' : arrowLeftIcon};
    var nameSet = false;
    var limitSet = false;
    var courseSet = false;
    $scope.createGroup = false;


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

        $scope.items = items;
    }

    $scope.toggle = function (item, list) {
      var idx = $scope.selectedItems.indexOf(item);
      if (idx > -1) {
        $scope.selectedItems.splice(idx, 1);
      }
      else {
        //list.push(item);
        $scope.selectedItems.push(item);
      }
    }

    $scope.exists = function (item, list) {
      return $scope.selectedItems.indexOf(item) > -1;
    }

    $scope.submitGroup = function(){
        submit = true;
        for (var i = 0; i < $scope.selectedItems.length; i++){
            var objectList = $scope.myGroupsList;
            var length3 = objectList.length;
            var object = $scope.myGroupsList[length3-1];
            $scope.selectedItems[i].id = object.id + 1;
            $scope.myGroupsList.push($scope.selectedItems[i]);
        }
        //$location.path('#/groups');
        if ($scope.createGroup == true) {
            objectList = $scope.myGroupsList;
            length4 = objectList.length;
            object = $scope.myGroupsList[length4-1];
            $scope.newObject.id = object.id + 1;
            $scope.myGroupsList.push($scope.newObject);



        }
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
            $scope.newObject.name = data;
            nameSet = true;
        }
        else if (key == 'limit') {
            $scope.newObject.limit = data;
            limitSet = true
        }
        else if (key == 'course') {
            courseSet = true;
        }
        if (nameSet == true && limitSet == true && courseSet == true) {
            $scope.createGroup = true;
        }
    }

    $scope.showTabDialog = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'tabDialog.tmpl.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true
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

         $scope.answer = function(answer) {
           if (answer==="useful"){
             swal(
               'Joined!',
               'Group(s) added.',
               'success'
             )
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
      swal({
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave!'
      }).then(function () {
        swal(
          'Removed!',
          'You are no longer in the group.',
          'success'
        )

        groupToLeave = {"studentId": $scope.sid,
                        "groupsId": group.id}

        console.log(groupToLeave);
        studentService.leaveGroup(groupToLeave)
              .then(function(){
                    getGroupInfo();
              })


      })
    }

}]);
