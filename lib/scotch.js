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
    _ = require('underscore'),
    compiler = require('./compiler'),
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

  // Base is the directory where the application server is run
  options.node_modules = path.resolve(join(dirname(process.argv[1]), 'node_modules'));

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
      out = {},
      modules = {},
      css = {};

  relPath = relPath.replace(/\.\w+$/, '') + '.js';

  var src = join(options.root, relPath);
  walk(src, options, modules, css);
  
  // _.each(modules, function(module, path) {
  //   var ext = extname(path).substring(1);
  //   modules[path] = (compiler[ext]) ? compiler[ext](module, path, css) : modules[path];
  // });

  out.js = wrap.js(modules);
  out.js += '\n\nrequire.register("' + basename(relPath) + '", function(m, e, require) { return require("/' + relPath + '"); });\n';
  out.css = wrap.css(css);

  fn(null, out);
};


var walk = exports.walk = function(src, options, out, css) {
  var root = options.root,
      ext = extname(src);

  // If we don't have an extension, add .js
  src = (!ext) ? src + '.js' : src;
  ext = ext.substring(1);

  var str = fs.readFileSync(src, 'utf8');

  var path = '/' + relative(root, src);
  str = (compiler[ext]) ? compiler[ext](str, path, css) : str;
  out[path] = str;

  var reqs = detective(str);
  reqs.forEach(function(req) {
    var node_module;

    if(req[0] === '/') {
      req = join(root, req);
    } else if(/^\.\//.test(req) || /^\.{2}/.test(req)) {
      req = join(dirname(src), req);
    } else {
      node_module = require.resolve(req);
      out[req] = 'module.exports = require("/' + relative(root, node_module) + '");';
      req = node_module;
    }

    walk(req, options, out, css);
  });

  return out;
};

// Test

// var scotch = create(__dirname + '/../example', {});
// scotch.render('views/index.html', {}, function(err, str) {
//   fs.writeFileSync(__dirname + '/../example/scotch.js', str);
// });

