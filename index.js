'use strict';

var electron = require('electron');
var remote = electron.remote;
var fileUtil = remote.require('./lib/fileUtil');
var baseDir = process.cwd();
var path = require('path');

var Vue = require('vue/dist/vue');
var marked = require('marked');

// Vueのインスタンス作成
var app = new Vue({
  el: '#app',

  data: {
    fileText: '',
    fileList: [],
    currentFile: null,
    searchReadme: ''
  },

  mounted: function() {
    fileUtil.fetchReadmeList(baseDir, function(err, fileList) {
      if(err) {
        console.error(err);
        return;
      }

      this.fileList = this.getArrangedFileList(baseDir, fileList);
    }.bind(this));
  },

  computed: {
    filteredFilename: function() {
      var self = this;
      return self.fileList.filter(function(file) {
        return file.moduleName.indexOf(self.searchReadme) !== -1;
      });
    }
  },

  methods: {
    getFile: function(file, event) {
      if(event) {
        event.preventDefault();
      }
      var rawText = fileUtil.getAsText(file.filePath);
      this.fileText = marked(rawText);
      this.currentFile = file;
    },

    getArrangedFileList: function(baseDir, fileList) {
      return fileList.map(function(filename) {
        var split = path.dirname(filename).split(path.sep);
        var modNames = [];

        for(var i = split.length - 1; i >= 0; i--) {
          if(split[i] == "node_modules") {
            break;
          }
          modNames.push(split[i]);
        }

        return {
          filePath: path.join(baseDir, filename),
          moduleName: modNames.join('/')
        }
      });
    }
  }
});
