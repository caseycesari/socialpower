var db = require('../db');

exports.index = function(req, res){
  console.log(__dirname)
  res.render('index', {
    title: 'SocialPower',
    officials: fs.readFileSync(process.cwd() + '/public/json/officials.json')
  });
};

exports.io = function(req, res) {
  db.byOfficial(function(err, dbRes) {
    if (err) console.log(err);
    res.send(dbRes);
  });
};
