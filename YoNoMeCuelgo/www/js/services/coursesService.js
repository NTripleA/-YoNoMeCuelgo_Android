angular.module('users')
.factory('CoursesService', [
'$http',
function($http) {
	var CoursesService = {};
	CoursesService.getCourses = function (course) {
		return $http.get("https://rocky-shore-7054.herokuapp.com/api/course/search/"+course)
		.then(function (response) {
			return response.data;
		})
		.then(null, function (err) {
			console.error(err);
		});
	};
	return CoursesService;
}]);
