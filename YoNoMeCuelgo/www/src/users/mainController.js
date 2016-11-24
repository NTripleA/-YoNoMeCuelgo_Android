var app = angular.module("users")
    .controller('MainController', function(userService, $mdSidenav, $mdBottomSheet, $timeout, $log, $scope, $mdDialog, $location, $rootScope, $q)
    {

    var self = this;
    self.toggleList   = toggleUsersList;
    $scope.name='Israel';
    $scope.receiver = false;
    $scope.loading=false;
    $scope.senderName = '';
    $scope.senderPhone = '';
    $scope.senderEmail = '';
    $scope.senderAddress = '';
    $scope.senderInstructions = '';
    $scope.receiverName = '';
    $scope.receiverPhone = '';
    $scope.receiverAddress = '';
    $scope.notifications = [];

    function storeNotification(title){
      var tempArray = $scope.notifications.slice();
      $scope.notifications.length = 0;
      $scope.notifications.push(title);
      for(var i = 0 ; i<tempArray.length ; i++){
        $scope.notifications.push(tempArray[i]);
      }
    }

    // $ionicPlatform.on("resume", function(){
       setTimeout(function() {
         var push = PushNotification.init({
         android: {
             senderID: "911672082483",
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
          var response = {
            'name':'Tahiri',
            'title':'Entertainment',
            'action':'wants to play.',
            'message':'I wanna play tic tac toe.'
          }
          console.log(response);
          storeNotification(response);
          // this.push.rx.notification()
          // .subscribe((data) => {
          //   alert('hey' + ': ' + 'hey');
          // });
        });
       }, 5000);


    // });

    // $ionicPlatform.ready(function() {
    //   var push = PushNotification.init({
    //   android: {
    //       senderID: "911672082483",
    //       vibrate: "true",
    //       sound: 'true'
    //   },
    //   browser: {
    //       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
    //   },
    //   windows: {}
    //   });
    // });


    $scope.route = function(path){
        $location.path(path);
    }

    $scope.receiverData = function(){
        $scope.loading = true;
        $scope.receiver = true;
        setTimeout(function(){ $scope.loading = false; }, 3000);
    }

    $scope.senderData = function(){
        $scope.loading = true;
        $scope.receiver = false;
        setTimeout(function(){ $scope.loading = false; }, 3000);
    }



    function removeNotification(index){
      var tempArray = $scope.notifications.slice();
      $scope.notifications.length = 0;
      for(var i = 0 ; i<tempArray.length ; i++){
        if(i!=index){
          $scope.notifications.push(tempArray[i]);
        }
      }
    }

    $scope.openAlert = function(index,name,message){
      swal({
        title: "Can you help "+name+"?",
        text: name+": "+message,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "Accept :)",
        cancelButtonText: "Reject :'(",
        closeOnConfirm: false,
        closeOnCancel: false
      },
      function(isConfirm) {
        if (isConfirm) {
          swal("Awesome", name+" will be happy to receive you.", "success");
          removeNotification(index);
        } else {
          swal("Rejected", "Don't worry, you still a cool person.", "error");
          removeNotification(index);
        }
      });
    }

    $scope.setRequest = function(){
        var object = {
            'puname' : $scope.senderName,
            'puphone' : $scope.senderPhone,
            'puemail' : $scope.senderEmail,
            'puaddress' : $scope.senderAddress,
            'puspecinst' : $scope.senderInstructions,
            'doname' : $scope.receiverName,
            'dophone' : $scope.receiverPhone,
            'doaddress' : $scope.receiverAddress
        }
        console.log(object);
    }

  this.desktopNotifications=true
  this.desktopNotificationIcon="fa fa-bell-slash";
  this.desktopNotificationHeader="Get Notified of Incoming Messages";
  this.desktopNotificationParagraph="Enable Desktop Notifications";
  $scope.toggleNotifications = function(){
    if(this.desktopNotificationIcon == "fa fa-bell-slash"){
        this.desktopNotificationIcon="fa fa-bell";
        this.desktopNotificationHeader="Do not want Message Notifications?";
        this.desktopNotificationParagraph="Disable Desktop Notifications";
        enableNotifications();
    }
    else{
        this.desktopNotificationIcon="fa fa-bell-slash";
        this.desktopNotificationHeader="Get Notified of Incoming Messages";
        this.desktopNotificationParagraph="Enable Desktop Notifications";
        this.desktopNotifications=false
    }

  }
      $scope.enableNotifications = function() {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else{
        // Ask the user for permission
        Notification.requestPermission(function (permission) {
                // If the user accepts, let's create a notification
            if (permission === "granted") {
                  var options = {
                        body: "Tahiri wants to play.",
                        icon: "http://www.przedszkoledelfinek.eu/site/assets/files/2654/canstockphoto5193832.jpg"
                    }
                  var notification = new Notification("Entertainment Alert",options);
                  storeNotification(options.body);
                  notification.onclick = function(event) {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    notification.close();
                    $mdSidenav('right').toggle();
                  }
                  this.desktopNotifications=true
            }
        });

    }
  }

  function sendNotification(){
    if(this.desktopNotifications == true){
        //Notification Here
    }
  }

    // *********************************
    // Internal methods
    // *********************************

    /**
     * Hide or Show the 'left' sideNav area
     */
    function toggleUsersList() {
      $mdSidenav('right').toggle();
    }

});
