var express = require('express');
var twit = require('twitter');
var router = express.Router();
var path = require('path');

var twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

twitter.get('statuses/user_timeline', { screen_name: "AlamoAlerts", count: "6" }, function(error, tweets, response){
  if(error) throw error;
  console.log(tweets[0].text);
  
});

router.get('/tweets/village', function(req, res, next) {
  twitter.get('statuses/user_timeline', { screen_name: "AlamoAlerts", count: "6" }, function(error, tweets, response){
    if(error) throw error;
    res.send(tweets);
  });
});

router.get('/tweets/south-lamar', function(req, res, next) {
  twitter.get('statuses/user_timeline', { screen_name: "AlamoAlerts", count: "6" }, function(error, tweets, response){
    if(error) throw error;
    res.send(tweets);
  });
});

router.get('/tweets/mueller', function(req, res, next) {
  twitter.get('statuses/user_timeline', { screen_name: "AlamoAlerts", count: "6" }, function(error, tweets, response){
    if(error) throw error;
    res.send(tweets);
  });
});

module.exports = router;
