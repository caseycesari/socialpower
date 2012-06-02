var express = require('express')
, routes = require('./routes')
, http = require('http')
, nt = require('ntwitter')
, es = require('es')
, socket = require('./socket')
, url = require('url');

var port = process.env.PORT || 3000;
var app = express();
var server = app.listen(port);
console.log('Express server listening on port ' + port);

socket(server);

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
    // only save tweets, not lists of friends
    if (data.id) {
      data._id = data.id;
      data._type = 'tweet';
      console.log(data);
      db.post(data);
      es({
        url: process.env.BONSAI_INDEX_URL + '/' + data._type + '/' + data._id,
        port: 80,
        method: 'POST',
        data: JSON.stringify(data)
      }, function(err, res) {
        console.log(err);
        console.log(res);
      });
    }
  });

  stream.on('end', function (response) {
    // Handle a disconnection
  });

  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
});

app.get('/', routes.index);
app.get('/io', routes.io);

