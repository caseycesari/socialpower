exports.index = function(req, res){
  console.log(__dirname)
  res.render('index', {
    title: 'Express',
    officials: fs.readFileSync(process.cwd() + '/public/json/officials.json')
  });
};

exports.iotest = function(req, res) {
  res.render('socket');
};
