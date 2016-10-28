'use strict';

var glob = require('glob');
var fs = require('fs');

var fileUtil = {
  fetchReadmeList: function(baseDir, cb) {
    glob('node_modules/**/README.md', function(err, matches) {
      if(err) {
        cb(err, null);
        return;
      }
      cb(null, matches);
    });
  },

  getAsText: function(filename) {
    return fs.readFileSync(filename, 'utf-8');
  }
};

module.exports = fileUtil;
