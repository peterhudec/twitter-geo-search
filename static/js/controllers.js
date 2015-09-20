var tweetSearchApp = angular.module('tweetSearchApp', []);

tweetSearchApp.controller('TweetListController', function ($scope, $http) {

	$scope.geoFilter = function (item) {
		return !$scope.showGeo || item.coordinates !== null;
	};

	$scope.search = function () {

		console.log($scope.query);

		$http.get('search', {
				params: {
					q: $scope.query
				}
			})
			.success(function (data) {
				console.log(data);
				$scope.tweets = data.data.statuses;
				$scope.allTweetsCount = data.data.statuses.length;
				$scope.geoTweetsCount = data.geoTweetsCount;
			})
			.error(function (err) {
				console.log(err);
			});
	};
});