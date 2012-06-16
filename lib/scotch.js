/*!
 * Scotch
 * Copyright(c) 2012 Matt Mueller <mattmuelle@gmail.com>
 * MIT Licensed
 */
var fs = require('fs'),
    path = require('path'),
    detective = require('detective'),
    cheerio = require('cheerio'),
    _ = require('underscore');

// exports = module.exports = require('./middleware');

// var plugins = exports.plugins = [];

// exports.register = function(ext, fn) {
//   ext = '.' + ext.replace(/^\./, '');
//   plugins[plugins.length] = { ext : ext, fn : fn };
// };


var create = exports.create = function(root, options) {
  var scotch = function(root, options) {
    scotch.root = root;
    scotch.options = options || {};
    return _.bind(scotch.engine, scotch);
  };

  scotch.__proto__ = exports;

  return scotch;
};

var engine = exports.engine = function(path, locals, fn) {
  var scotch = this;
  fs.readFile(path, 'utf8', function(err, str) {
    if(err) return fn(err);
    var $ = cheerio.load(str);

    $('script[src]');

  });
};

module.exports = create();