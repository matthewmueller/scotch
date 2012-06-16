/*!
 * Scotch
 * Copyright(c) 2012 Matt Mueller <mattmuelle@gmail.com>
 * MIT Licensed
 */
var fs = require('fs'),
    path = require('path'),
    join = path.join,
    relative = path.relative,
    extname = path.extname,
    dirname = path.dirname,
    detective = require('detective'),
    cheerio = require('cheerio'),
    _ = require('underscore'),
    compiler = require('./compiler'),
    wrap = require('./wrap');

// exports = module.exports = require('./middleware');

// var plugins = exports.plugins = [];

// exports.register = function(ext, fn) {
//   ext = '.' + ext.replace(/^\./, '');
//   plugins[plugins.length] = { ext : ext, fn : fn };
// };


var create = exports.create = function(root, options) {
  var scotch = function(root, options) {
    scotch.root = root || scotch.root;
    scotch.root = options || scotch.options;
    return scotch;
  };

  scotch.root = root;
  scotch.options = options || {};

  scotch.__proto__ = exports;

  return scotch;
};

// var engine = exports.engine = function(path) {
//   var scotch = this;
//   scotch.render(path, {}, function(err, modules) {

//   });
// };

var render = exports.render = function(path, options, fn) {
  var scotch = this;
      view = fs.readFileSync(join(scotch.root, path), 'utf8'),
      $ = cheerio.load(view),
      modules = {};
  console.log(scotch.root);
  scotch.walk(join(scotch.root, $('script[src]').attr('src')), modules);
  
  _.each(modules, function(module, path) {
    var ext = extname(path).substring(1);
    modules[path] = (compiler[ext]) ? compiler[ext](module, path) : modules[path];
    // if(!modules[path]) delete modules[path];
  });

  modules = wrap(modules);
  fn(null, { js : modules });
};


var walk = exports.walk = function(src, out) {
  var root = this.root,
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

    walk.call(this, req, out);
  });

  return out;
};

module.exports = create();

// Test

// var scotch = create(__dirname + '/../example', {});
// scotch.render('views/index.html', {}, function(err, str) {
//   fs.writeFileSync(__dirname + '/../example/scotch.js', str);
// });

