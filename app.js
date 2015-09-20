var querystring = require('querystring');

var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter(require('./config'));

var express = require('express');
var app = express();
app.use(express.static('static'));
app.use(express.static('node_modules'));

var success = function (req, res, requests, allCnt, geoTweets) {
    var max_requests = req.query.max_requests || 1;
    requests = requests || 1;
    allCnt = allCnt || 0;
    if (geoTweets === undefined) {
        geoTweets = [];
    }

    return function (data) {
        data = JSON.parse(data);

        geoTweets = geoTweets.concat(data.statuses.filter(function (tweet) {
            if (tweet.coordinates) {
                return true;
            }
        }));

        if (requests < max_requests) {
            console.log('Requests %s: %s tweets, %s geo tweets.', requests, allCnt, geoTweets.length);

            ++requests;
            allCnt += data.statuses.length;

            var nextParams = querystring.parse(data.search_metadata.next_results.substring(1));
            twitter.getSearch(nextParams, error(req, res), success(req, res, requests, allCnt, geoTweets));
        } else {
            res.json({
                requests: requests,
                allTweetsCount: allCnt,
                geoTweetsCount: geoTweets.length,
                nextResults: '/next' + data.search_metadata.next_results,
                geoTweets: geoTweets,
                data: data
            });
        }
    };
};

var error = function (req, res) {
    return function (err, response, body) {
        res.json(err);
    };
};

app.get('/search', function (req, res) {
    twitter.getSearch({
        q: req.query.q,
        count: 100,
        result_type: 'recent'
        // ,
        // geocode: '0,0,99999mi'
    }, error(req, res), success(req, res));
});

// TODO: The sparse occurence of geo tweets renderes this one useles.
app.get('/next', function (req, res) {
    twitter.getSearch(req.query, error(req, res), success(req, res));
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    if (host === '::') {
        host = 'localhost';
    }
    console.log('App listening att http://%s:%s', host, port);
});