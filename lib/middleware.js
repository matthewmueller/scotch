var browserify = require('browserify'),
    path = require('path'),
    fs = require('fs'),
    compiler = require('./compiler'),
    join = path.join,
    basename = path.basename,
    stats = fs.lstatSync,
    readdir = fs.readdirSync,
    env = process.env.NODE_ENV || 'development';

var css = compiler.css;

exports = module.exports = function(directory, options) {
  options = options || {};

  return function(req, res, next) {
    var b = browserify(options),
        url = req.url.split('?')[0];

    if (url !== '/scotch.js' && url !== '/scotch.css') return next();

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

    // Add the files to browserify
    files.forEach(function(file) {
      try {
        b.addEntry(file + '.js');
      } catch(e) {
        try {
          b.addEntry(file + '.coffee');
        } catch(e) { console.log(e); }
      }
    });

    res.statusCode = 200;
    res.setHeader('last-modified', b.modified.toString());

    if(url === '/scotch.js') {
      res.setHeader('content-type', 'text/javascript');
      res.send(b.bundle());
    } else {
      res.setHeader('content-type', 'text/css');
      res.send(css.join('\n\n'));
      css = compiler.css = [];
    }
  };
};