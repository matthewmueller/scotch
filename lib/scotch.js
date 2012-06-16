/*!
 * Scotch
 * Copyright(c) 2012 Matt Mueller <mattmuelle@gmail.com>
 * MIT Licensed
 */
var fs = require('fs'),
    path = require('path'),
    join = path.join,
    relative = path.relative,
    dirname = path.dirname,
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
    scotch.root = root || scotch.root;
    scotch.root = options || scotch.options;
    return _.bind(scotch.engine, scotch);
  };

  scotch.root = root;
  scotch.options = options || {};

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

var render = exports.render = function(path, options, fn) {
  var scotch = this;
      view = fs.readFileSync(join(scotch.root, path), 'utf8'),
      $ = cheerio.load(view),
      paths = {};

  walk(join(scotch.root, dirname(path), $('script[src]').attr('src')), paths);
  console.log(paths);
};

var find = exports.find = function(src, out) {
  var str = fs.readFileSync(src, 'utf8'),
      requires = detective(str);
  
  requires.forEach(function(req) {
    if(req[0] === '/') {
      var js = out[rel] = fs.readFileSync(join(scotch.root, req));
      req = join(scotch.root, req);
      var rel = '/' + relative(scotch.root, req);
      // out[]
      console.log(relative(scotch.root, req));
    }
  });
};

var walk = exports.walk = function(src, out) {
  var root = scotch.root,
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

    walk(req, out);
  });

  return out;
};

module.exports = create();

// Test

var scotch = create(__dirname + '/../example', {});
scotch.render('views/index.html', {}, function(err, obj) {
  console.log(obj);
});

