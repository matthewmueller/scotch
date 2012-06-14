var browserify = require('browserify'),
    _ = require('underscore'),
    path = require('path'),
    fs = require('fs'),
    compiler = require('./compiler'),
    join = path.join,
    basename = path.basename,
    stats = fs.lstatSync,
    readdir = fs.readdirSync,
    env = process.env.NODE_ENV || 'development';

var style = compiler.style,
    cache = false;

exports = module.exports = function(directory, options) {
  options = options || {};

  return function(req, res, next) {
    var b = browserify(options),
        url = req.url.split('?')[0];

    if (url !== '/scotch.js' && url !== '/scotch.css') return next();

    // Don't perform actions twice for scotch.js and scotch.css
    if(cache) {
      res.setHeader('content-type', cache.type);
      res.send(cache.content);
      cache = false;
      return;
    }

    var files = readdir(directory)
      .filter(function(file) {
        return stats(join(directory,file)).isDirectory();
      })
      .map(function(file) {
        return join(directory, file, basename(file));
      });

    // Default extensions
    b.register('.styl', compiler.styl);
    b.register('.css', compiler.css);
    b.register('.jst', compiler.hogan);
    b.register('.json', compiler.json);

    // Add the files to browserify
    files.forEach(function(file) {
      try {
        b.addEntry(file + '.js');
      } catch(e) {
        try {
          b.addEntry(file + '.coffee');
        } catch(e) { }
      }
    });

    res.statusCode = 200;
    res.setHeader('last-modified', b.modified.toString());

    if(url === '/scotch.js') {
      res.setHeader('content-type', 'text/javascript');
      res.send(b.bundle());
      cache = {type : 'text/css', content : _(style).toArray().join('\n\n') };
    } else {
      res.setHeader('content-type', 'text/css');
      res.send(_(style).toArray().join('\n\n'));
      cache = {type : 'text/javascript', content : b.bundle() };
    }
  };
};