var express = require('express')
, routes = require('./routes')
, http = require('http')
, oath = require('oath')
, nt = require('ntwitter')
, socket = require('./socket');

var app = express();
var twit = new nt({
  consumer_key: process.env.SP_TWITTER_CONSUMER_KEY,  
  consumer_secret: process.env.SP_TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.SP_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.SP_TWITTER_ACCESS_TOKEN_SECRET
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
});

app.get('/', routes.index);
app.get('/io', routes.iotest);

var server = app.listen(3000);
socket(server);

console.log("Express server listening on port 3000");
