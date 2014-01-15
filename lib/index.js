var path = require('path');

module.exports.scriptsDir = path.join(__dirname, 'client');
module.exports.sparkStream = require('./spark_stream');
