'use strict';

angular.module('users')
	.directive('searchbar',function(){
		return {
        templateUrl:'src/search bar/view/searchBar.html',
        restrict: 'E',
        replace: false,
    	}
	});