var app = angular.module("users")
.controller('groupController', ['studentService', '$scope', '$compile', '$location', '$rootScope', '$mdDialog', function(studentService, $scope, $compile, $location, $rootScope, $mdDialog) {

    var arrowDownIcon = "fa fa-chevron-down"
    var arrowLeftIcon = "fa fa-chevron-left"
    var members = [];

    $scope.currentPage = 1;
    $scope.pageSize = 2;

//    var members = [{'name' : 'Tahiri Ciquitraque'}, {'name' : 'Nelson Triple A'}, {'name' : 'Israel La Bestia'}]
    studentService.getStudentCourses(1)
                    .then(function(response){

                        var courses = response;

                        $scope.courseList = [];
                    /*list of the courses the student has*/
                        for(var i = 0; i < courses.length; i++)
                        {
                            $scope.courseList.push({'idc' : courses[i].courseId,
                                'code': courses[i].courseCode,
                                'title' : courses[i].courseName
                            })
                        }

                    });
//    var courses = [
//                     {
//                       "courseId": "1",
//                       "courseName": "Database",
//                       "courseCode": "ICOM5016",
//                       "tutors": [
//
//                       ]
//                     },
//                     {
//                       "courseId": "2",
//                       "courseName": "Software Engineering",
//                       "courseCode": "ICOM4009",
//                       "tutors": [
//                         {
//                           "tutorId": "1",
//                           "userFirstName": "Israel",
//                           "userLastName": "Figueroa",
//                           "userImage": "https:\/\/scontent-atl3-1.xx.fbcdn.net\/v\/t1.0-9\/14724397_1206577912739845_4904131675000625869_n.jpg?oh=ff5b1a56c65403fa5b38d28a8b5d71e5&oe=589522A8"
//                         }
//                       ]
//                     },
//                     {
//                       "courseId": "3",
//                       "courseName": "Mate Der Diablo",
//                       "courseCode": "ICOM666",
//                       "tutors": [
//                         {
//                           "tutorId": "1",
//                           "userFirstName": "Israel",
//                           "userLastName": "Figueroa",
//                           "userImage": "https:\/\/scontent-atl3-1.xx.fbcdn.net\/v\/t1.0-9\/14724397_1206577912739845_4904131675000625869_n.jpg?oh=ff5b1a56c65403fa5b38d28a8b5d71e5&oe=589522A8"
//                         }
//                       ]
//                     }
//                       ];
    studentService.getStudentGroups(1)
                   .then(function(response) {

                   var groups = response;
                   /*Returns the list of members for a group*/
                       function getMembers(members)
                       {
                           var membersToAdd = [];
                           for(var i = 0; i < members.length; i++)
                           {
                               var object = {'first': members[i].userFirstName,
                                   'last' : members[i].userLastName,
                                   'image' : members[i].userImage
                               }
                               membersToAdd.push(object);
                           }

                   //        console.log(membersToAdd);
                           return membersToAdd;
                       }
                   /*List of personal groups*/
                       for(var i = 0; i < groups.length; i++)
                       {
                           $scope.myGroupsList.push({'id': groups[i].groupId,
                               'idc': groups[i].courseId,
                               'name': groups[i].groupName,
                               'size': groups[i].groupSize,
                               'limit': groups[i].groupCapacity,
                               'arrowIcon': arrowLeftIcon,
                               'members': getMembers(groups[i].members)
                           });

                       }


                   })
                   .then(function(){
                     studentService.getAllGroups()
                                            .then(function(response3) {

                                            var allGroups = response3;
                                            /*list of groups that the user is NOT part of */

                                              /*verifies if the group is already on the personal groupList*/
                    //                          function groupExist(group)
                    //
                                                for(var i = 0; i < allGroups.length; i++)
                                                {
                                                    $scope.myGroupsList.map(function(group)
                                                    {
                                                        if(group.id === allGroups[i].groupsId)
                                                        {
                                                            allGroups.splice(i,1);
                                                        }

                                                    });

                                                }
                                                console.log("My groups: "+JSON.stringify($scope.myGroupsList));
                                                console.log("Others: "+ JSON.stringify(allGroups));
                                                $scope.groupList = [];
                                                for(var i = 0; i < allGroups.length; i++)
                                                {
                    //                                if(!groupExist(allGroups[i]))
                    //                                {
                                                        $scope.groupList.push({'id': allGroups[i].groupsId,
                                                                    'idc': allGroups[i].courseId,
                                                                    'name': allGroups[i].groupName,
                                                                    'size': allGroups[i].groupSize,
                                                                    'limit': allGroups[i].groupCapacity,
                                                                    'arrowIcon': arrowLeftIcon
                                                                });
                    //                                }
                                                }



                                            });





                   });
//      var groups = [
//                      {
//                        "groupId": "1",
//                        "courseId": "1",
//                        "groupName": "DB Project",
//                        "groupSize": 3,
//                        "groupCapacity": 3,
//                        "members": [
//                          {
//                            "userFirstName": "Nelson",
//                            "userLastName": "Alemar",
//                            "userImage": "https:\/\/fbcdn-profile-a.akamaihd.net\/hprofile-ak-xtf1\/v\/t1.0-1\/13912618_10154625059185827_4804033282118954744_n.jpg?oh=71c307466a6f3cf85ffc580d1a588c02&oe=58C703DB&_gda_=1485738904_e299d10033dcc5340dcf7c055ddfd831"
//                          }
//                        ]
//                      },
//                      {
//                        "groupId": "2",
//                        "courseId" : "2",
//                        "groupName": "Study Group",
//                        "groupSize": 4,
//                        "groupCapacity": 5,
//                        "members": [
//                          {
//                            "userFirstName": "Nelson",
//                            "userLastName": "Alemar",
//                            "userImage": "https:\/\/fbcdn-profile-a.akamaihd.net\/hprofile-ak-xtf1\/v\/t1.0-1\/13912618_10154625059185827_4804033282118954744_n.jpg?oh=71c307466a6f3cf85ffc580d1a588c02&oe=58C703DB&_gda_=1485738904_e299d10033dcc5340dcf7c055ddfd831"
//                          }
//                        ]
//                      },
//                      {
//                        "groupId": "3",
//                        "courseId" : "3",
//                        "groupName": "Chill",
//                        "groupSize": 5,
//                        "groupCapacity": 10,
//                        "members": [
//                          {
//                            "userFirstName": "Nelson",
//                            "userLastName": "Alemar",
//                            "userImage": "https:\/\/fbcdn-profile-a.akamaihd.net\/hprofile-ak-xtf1\/v\/t1.0-1\/13912618_10154625059185827_4804033282118954744_n.jpg?oh=71c307466a6f3cf85ffc580d1a588c02&oe=58C703DB&_gda_=1485738904_e299d10033dcc5340dcf7c055ddfd831"
//                          }
//                        ]
//                      }
//                    ];


//        var allGroups = [
//                          {
//                            "groupsId": "1",
//                            "courseId": "1",
//                            "groupName": "DB Project",
//                            "groupSize": 3,
//                            "groupCapacity": 3,
//                            "senderId": "1"
//                          },
//                          {
//                            "groupsId": "2",
//                            "courseId": "2",
//                            "groupName": "Study Group",
//                            "groupSize": 4,
//                            "groupCapacity": 5,
//                            "senderId": "1"
//                          },
//                          {
//                            "groupsId": "3",
//                            "courseId": "3",
//                            "groupName": "Chill",
//                            "groupSize": 5,
//                            "groupCapacity": 10,
//                            "senderId": "1"
//                          }
//                        ];





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





//    $scope.groupList = [
//    {'id' : '1','idc' : '1', 'name' : 'Project', 'size' : '3', 'limit' : '4', 'arrowIcon' : arrowLeftIcon, 'members' : members},
//    {'id' : '2', 'idc' : '2', 'name' : 'Exam 1', 'size' : '3', 'limit' : '3', 'arrowIcon' : arrowLeftIcon, 'members' : members},
//    {'id' : '3', 'idc' : '3', 'name' : 'Chilea', 'size' : '3', 'limit' : '5', 'arrowIcon' : arrowLeftIcon, 'members': members},
//    {'id' : '4', 'idc' : '4', 'name' : 'Study Group', 'size' : '3', 'limit' : '8', 'arrowIcon' : arrowLeftIcon, 'members': members},
//    {'id' : '5', 'idc' : '5', 'name' : 'Final Project', 'size' : '3', 'limit' : '3', 'arrowIcon' : arrowLeftIcon, 'members': members},
//    {'id' : '6', 'idc' : '1', 'name' : 'Final Exam', 'size' : '3', 'limit' : '4', 'arrowIcon' : arrowLeftIcon, 'members': members},
//    {'id' : '7', 'idc' : '3', 'name' : 'Exam 3', 'size' : '3', 'limit' : '5', 'arrowIcon' : arrowLeftIcon, 'members': members}
//    ]





//    $scope.myGroupsList = [
//        {'id' : '1', 'idc' : '1', 'name' : 'Project', 'size' : '3', 'limit' : '4', 'arrowIcon' : arrowLeftIcon, 'members' : members},
//        {'id' : '2', 'idc' : '2', 'name' : 'Exam 1', 'size' : '3', 'limit' : '3', 'arrowIcon' : arrowLeftIcon, 'members' : members}
//        ]

//    $scope.courseList = [
//    {'id' : '1', 'idc' : '1', 'code' : 'ICOM4035', 'title' : 'Data Structures'},
//    {'id' : '2', 'idc' : '2', 'code' : 'ICOM4075', 'title' : 'Foundations of Computing'},
//    {'id' : '3', 'idc' : '3', 'code' : 'ICOM4015', 'title' : 'Advanced Programming'},
//    {'id' : '4', 'idc' : '4', 'code' : 'ICOM4009', 'title' : 'Software Engineering'},
//    {'id' : '5', 'idc' : '5', 'code' : 'MATE0666', 'title' : 'Mate der Diablou'}
//    ]





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

    $scope.exit = function(){
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
      })
    }

}]);
