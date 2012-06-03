var es = require('es');

exports.all = function(cb) {
  es({
    url: process.env.BONSAI_INDEX_URL + '/_search',
    method: 'POST',
    data: {
      query: {
        match_all: {}
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
