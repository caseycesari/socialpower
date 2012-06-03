// grab officials.json and expose for easy loading, like:
// var officials = require('./officials')

var fs = require('fs')

module.exports = JSON.parse(fs.readFileSync('public/json/officials.json'))
