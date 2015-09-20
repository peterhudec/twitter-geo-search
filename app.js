var querystring = require('querystring');

var Twitter = require('twitter-node-client').Twitter;
var twitter = new Twitter(require('./config'));

var express = require('express');
var app = express();
app.use(express.static('static'));
app.use(express.static('node_modules'));

var error = function (req, res) {
    return function (err, response, body) {
        console.log('ERROR: %s', err.data);
        res.status(err.statusCode);
        res.json(err.data);
    };
};

var success = function (req, res) {
    return function (data) {
        res.json(JSON.parse(data));
    };
};

app.get('/search', function (req, res) {
    twitter.getSearch({
        q: req.query.q,
        count: 100,
        result_type: 'recent',
        geocode: req.query.geocode
    }, error(req, res), success(req, res));
});

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