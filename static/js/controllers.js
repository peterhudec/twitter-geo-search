var tweetSearchApp = angular.module('tweetSearchApp', ["leaflet-directive"]);

tweetSearchApp.controller('TweetListController', function ($scope, $http) {
	angular.extend($scope, {
      center: {
          lat: 40.095,
          lng: -3.823,
          zoom: 4
      },
      defaults: {
          scrollWheelZoom: false
      }
  });

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

tweetSearchApp.controller('GeoItemController', function ($scope) {
	var coordinates = $scope.$parent.tweet.coordinates.coordinates;

	angular.extend($scope, {
		center: {
			zoom: 14,
			lng: coordinates[0],
			lat: coordinates[1]
		},
		markers: {
			marker: {
				lng: coordinates[0],
				lat: coordinates[1]
			}
		}
	});
});