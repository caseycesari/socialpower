var db = require('../db');

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.io = function(req, res) {
  db.all(function(err, dbRes) {
    console.log(err);
    console.log(dbRes);
    res.send(dbRes);
  });
};
