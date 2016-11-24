var app = angular.module("users")
    .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
          $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
          $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
          $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    })
    .controller('videoCallCtrl', function(userService, $mdSidenav, $mdBottomSheet, $timeout, $log, $scope, $mdDialog, $location, $rootScope, $q)
    {
});
