
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , oath = require('oath');

var app = express();
var twitterConsumerKey = process.env.SP_TWITTER_CONSUMER_KEY;
var twitterConsumerSecret = process.env.SP_TWITTER_CONSUMER_SECRET;

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

app.get('/', routes.index);
app.get('/io', routes.iotest);

http.createServer(app).listen(3000);

console.log("Express server listening on port 3000");
