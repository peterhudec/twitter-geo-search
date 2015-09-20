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

  var success = function (data) {
		console.log(data);
		$scope.tweets = $scope.tweets.concat(data.statuses);
		$scope.nextResultsQuerystring = data.search_metadata.next_results;

		var geoTweets = data.statuses.filter(function (tweet) {
        if (tweet.coordinates) {
            return true;
        }
    });

		$scope.allTweetsCount += data.statuses.length;
		$scope.geoTweetsCount += geoTweets.length;
	};

	var error = function (err) {
		console.log(err);
	};

	$scope.geoFilter = function (item) {
		return !$scope.showGeo || item.coordinates !== null;
	};

	$scope.search = function () {
		$scope.tweets = [];
		$scope.allTweetsCount = 0;
		$scope.geoTweetsCount = 0;

		$http.get('search', {
			params: {
				q: $scope.query
			}
		}).success(success).error(error);
	};

	$scope.next = function() {
		$http.get('next' + $scope.nextResultsQuerystring, {}).success(success).error(error);
		delete $scope.nextResultsQuerystring;
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