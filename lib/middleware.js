var browserify = require('browserify'),
    path = require('path'),
    fs = require('fs'),
    compiler = require('./compiler'),
    join = path.join,
    basename = path.basename,
    readdir = fs.readdirSync,
    env = process.env.NODE_ENV || 'development';

var css = compiler.css;

exports = module.exports = function(directory, options) {
  options = options || {};

  return function(req, res, next) {
    var b = browserify(options),
        url = req.url.split('?')[0];

    if (url !== '/bundle.js' && url !== '/bundle.css') return next();

    var files = readdir(directory).map(function(file) {
      var name = basename(file);
      return join(file, name);
    });

    // Register the extensions
    b.register('.styl', compiler.styl);
    b.register('.jst', compiler.hogan);

    // Add the files to browserify
    files.forEach(function(file) {
      b.addEntry(join(directory, file));
    });

    res.statusCode = 200;
    res.setHeader('last-modified', b.modified.toString());

    if(url === '/bundle.js') {
      res.setHeader('content-type', 'text/javascript');
      res.send(b.bundle());
    } else {
      res.setHeader('content-type', 'text/javascript');
      res.send(css.join('\n\n'));
      css = compiler.css = [];
    }
  };
};