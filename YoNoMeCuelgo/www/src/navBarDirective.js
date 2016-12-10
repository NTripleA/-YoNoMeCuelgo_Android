'use strict';

angular.module('users')
	.directive('navbar',function(){
		return {
        templateUrl:'src/navBar.html',
        restrict: 'E',
        replace: true,
    	}
	});