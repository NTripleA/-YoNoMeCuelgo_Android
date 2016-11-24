var app = angular.module("users")
.controller('SettingsController', function($scope, $compile) {
  var user = firebase.auth().currentUser;
  if(typeof(user)=='undefined' || !user){
    $scope.userName="User"
  }
  else{
    $scope.userName=user.displayName;
  }

  var user = firebase.auth().currentUser;
  if(typeof(user)=='undefined' || !user){
    $scope.profilePicture="http://dialogo1.dialogo.netdna-cdn.com/wp-content/uploads/2015/12/IMG_8918.jpg?2f7f98";
  }
  else{
    $scope.profilePicture=user.photoURL;
  }

  $scope.submitData = function(){
    firebase.auth().currentUser.updateProfile({
  displayName: $scope.userName,
  photoURL: $scope.photoURL
}).then(function() {
    console.log('Profile updated successfully!');
    $scope.userName = firebase.auth().currentUser.displayName;
    $scope.profilePicture = firebase.auth().currentUser.photoURL;
  // "Jane Q. User"
}, function(error) {
  console.log('An error happened.');
});
  }

  $scope.add = function(){
  var f = document.getElementById('file').files[0],
      r = new FileReader();
  r.onloadend = function(e){
    var data = e.target.result;
    $scope.photoURL = data;
    $scope.submitData();
    //send your binary data via $http or $resource or do anything else with it
  }
  r.readAsDataURL(f);
}
});
