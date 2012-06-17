/*
 * Scotch
 * Copyright(c) 2012 Matt Mueller <mattmuelle@gmail.com>
 * MIT Licensed
 */
var fs = require('fs'),
    path = require('path'),
    join = path.join,
    relative = path.relative,
    extname = path.extname,
    basename = path.basename,
    dirname = path.dirname,
    detective = require('detective'),
    cheerio = require('cheerio'),
    _ = require('underscore'),
    compiler = require('./compiler'),
    colors = require('colors'),
    wrap = require('./wrap');

// exports = module.exports = require('./middleware');

// var plugins = exports.plugins = [];

// exports.register = function(ext, fn) {
//   ext = '.' + ext.replace(/^\./, '');
//   plugins[plugins.length] = { ext : ext, fn : fn };
// };

exports = module.exports = function(root, options, fn) {
  options = options || {};
  options.root = root;

  return function(path, locals, cb) {
    render(path, options, function(err, obj) {
      if(err) return cb(err);
      locals.scotch = obj;
      fn(path, locals, cb);
    });
  };
};

var render = exports.render = function(path, options, fn) {
  var view = fs.readFileSync(path, 'utf8'),
      relPath = relative(options.root, path),
      modules = {},
      css = {};

  relPath = relPath.replace(/\.\w+$/, '') + '.js';

  var src = join(options.root, relPath);
  walk(src, options, modules);
  
  _.each(modules, function(module, path) {
    var ext = extname(path).substring(1);
    modules[path] = (compiler[ext]) ? compiler[ext](module, path, css) : modules[path];
  });

  modules = wrap(modules);
  fn(null, { js : modules, css : _.toArray(css) });
};


var walk = exports.walk = function(src, options, out) {
  var root = options.root,
      str = fs.readFileSync(src, 'utf8');

  var path = '/' + relative(root, src);
  out[path] = str;

  var reqs = detective(str);
  reqs.forEach(function(req) {
    if(req[0] === '/') {
      req = join(root, req);
    } else if(/^\.\//.test(req) || /^\.{2}/.test(req)) {
      req = join(dirname(src), req);
    } else {
      console.log('TODO: implement node_modules');
    }

    walk(req, options, out);
  });

  return out;
};

// Test

// var scotch = create(__dirname + '/../example', {});
// scotch.render('views/index.html', {}, function(err, str) {
//   fs.writeFileSync(__dirname + '/../example/scotch.js', str);
// });

