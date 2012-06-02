
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.iotest = function(req, res) {
  res.render('socket');
};
