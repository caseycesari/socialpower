var db = require('../db');

exports.index = function(req, res){
  console.log(__dirname)
  res.render('index', {
    title: 'Express',
    officials: fs.readFileSync(process.cwd() + '/public/json/officials.json')
  });
};

exports.io = function(req, res) {
  db.all(function(err, dbRes) {
    console.log(err);
    console.log(dbRes);
    res.send(dbRes);
  });
};
