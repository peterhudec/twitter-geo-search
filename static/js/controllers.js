var tweetSearchApp = angular.module('tweetSearchApp', ["leaflet-directive", "infinite-scroll", 'ui.bootstrap']);

tweetSearchApp.controller('TweetListController', ['$scope', '$http', 'leafletData', function ($scope, $http, leafletData) {
	angular.extend($scope, {
			loading: false,
			showGeo: true,
			allTweetsCount: 0,
			geoTweetsCount: 0,
      formMapCenter: {
          lat: 30,
          lng: 100,
          zoom: 2
      },
      defaults: {
          scrollWheelZoom: false
      }
  });

	leafletData.getMap('main-map').then(function(map) {
    setTimeout(function () {
    	map.invalidateSize();
    });
	});

  var success = function (data) {
		$scope.loading = false;
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

		if ($scope.filtered.length < 3) {
			console.log('filtered', $scope.filtered.length);
			$scope.next();
		};
	};

	var error = function (err) {
		console.log('error', err);
		$scope.error = JSON.parse(err);
		console.log($scope.error);
	};

	$scope.geoFilter = function (item) {
		return !$scope.showGeo || item.coordinates !== null;
	};

	$scope.search = function () {
		delete $scope.error;
		$scope.tweets = [];
		$scope.allTweetsCount = 0;
		$scope.geoTweetsCount = 0;

		var params ={
			q: $scope.query
		}

		if ($scope.enableGeolocation) {
			angular.extend(params, {
				geocode: $scope.formMapCenter.lat + ',' + $scope.formMapCenter.lng + ',30000mi'
			});
		}

		$http.get('search', {params: params}).success(success).error(error);
		$scope.loading = true;
	};

	$scope.next = function() {
		if ($scope.nextResultsQuerystring) {
			$http.get('next' + $scope.nextResultsQuerystring, {}).success(success).error(error);
			$scope.loading = true;
		}
	};
}]);

tweetSearchApp.controller('ItemController', function ($scope) {
	
});

tweetSearchApp.controller('GeoItemController', ['$scope', 'leafletData', function ($scope, leafletData) {
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

	leafletData.getMap($scope.$parent.tweet.id).then(function(map) {
	    setTimeout(function () {
	    	map.invalidateSize();
	    });
	});

}]);