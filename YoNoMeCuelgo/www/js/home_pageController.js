var app = angular.module("users")
.controller('homePageController',['countdownService','$scope','$compile', function(countdownService,$scope, $compile) {

  $scope.countdownResponse=[];
  // GET COUNTDOWN
  countdownService.getCountdown(1)
  .then(function(response){
    response.map(function(countdown){
      $scope.countdownResponse.push(countdown);
    });
    $scope.countdown = $scope.countdownResponse[0].title;
    $scope.setDate(new Date($scope.countdownResponse[0].time));
  });

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
        $scope.saveCountdown();

        //MAKE POST TO ENDPOINT HERE Params: title = $scope.countdown, time = date
  }





}]);
