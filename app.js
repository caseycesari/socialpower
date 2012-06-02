
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, http = require('http')
, oath = require('oath')
, nt = require('ntwitter')
, socket = require('./socket');

var app = express();
var twitterConsumerKey = process.env.SP_TWITTER_CONSUMER_KEY;
var twitterConsumerSecret = process.env.SP_TWITTER_CONSUMER_SECRET;
var twitterAccessToken = process.env.SP_TWITTER_ACCESS_TOKEN;
var twitterAccessTokenSecret = process.env.SP_TWITTER_ACCESS_TOKEN_SECRET;

var twit = new nt({
  consumer_key: twitterConsumerKey,  
  consumer_secret:  twitterConsumerSecret,
  access_token_key: twitterAccessToken,
  access_token_secret: twitterAccessTokenSecret,
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  //app.set('view options', { layout: false });
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware({
    src: __dirname + '/public',
    compress: true
  }));
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

twit.stream('user', {track:'socialpowerphl'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data);
  });

  stream.on('end', function (response) {
    // Handle a disconnection
  });

  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
  
  // Disconnect stream after five seconds
  setTimeout(stream.destroy, 5000);
});

app.get('/', routes.index);
app.get('/io', routes.iotest);



var server = app.listen(3000);
socket(server);

console.log("Express server listening on port 3000");

