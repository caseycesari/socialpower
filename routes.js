var db = require('./db');
var fs = require('fs');

module.exports = function(app) {
  app.get('/', function(req, res){
    console.log(__dirname)
    res.render('index', {
      title: 'SocialPower',
      officials: fs.readFileSync(process.cwd() + '/public/json/officials.json')
    });
  });

  app.get('/io', function(req, res) {
    db.byOfficial(function(err, dbRes) {
      if (err) console.log(err);
      res.send(dbRes);
    });
  });
};
