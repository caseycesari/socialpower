var es = require('es');
var officials = require('./officials');

exports.all = function(cb) {
  es({
    url: process.env.BONSAI_INDEX_URL + '/_search?pretty=true',
    method: 'POST',
    data: {
      query: {
        match_all: {}
      },
      size: 9999
    }
  }, cb)
}

exports.loadOfficials = function(cb) {
  // post officials to db
  var data = '';
  officials.forEach(function(official) {
    official._id = official.id
    official._type = 'official'
    data += JSON.stringify({index: {_id: official.id}}) + '\n'
    data += JSON.stringify(official) + '\n'
  });
  es({
    url: process.env.BONSAI_INDEX_URL + '/official/_bulk',
    method: 'POST',
    data: data
  }, cb);
  // deactivate officials that weren't updated
}

exports.byOfficial = function(cb) {
  es({
    url: process.env.BONSAI_INDEX_URL + '/_search',
    method: 'POST',
    data: {
      query: {
        
      }
    }
  }, cb)
}

exports.get = function(type, id, cb) {
  es({
    url: process.env.BONSAI_INDEX_URL + '/' + type + '/' + id,
  }, cb)
}

exports.post = function(data, cb) {
  es({
    url: process.env.BONSAI_INDEX_URL + '/' + data._type + '/' + data._id,
    method: 'POST',
    data: data
  }, cb)
}
