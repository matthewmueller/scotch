var _ = require('underscore');

exports.js = function(js) {
  var buf = '';
  buf += '\n// CommonJS require()\n\n';
  buf += require + '\n\n';
  buf += 'require.modules = {};\n\n';
  buf += 'require.aliases = {};\n\n';
  buf += 'require.resolve = ' + resolve + ';\n\n';
  buf += 'require.register = ' + register + ';\n\n';
  buf += 'require.relative = ' + relative + ';\n\n';
  _.each(js, function(str, path){
    buf += '\nrequire.register("' + path + '", Function(\n';
    buf += '["module", "exports", "require"],\n';
    buf += JSON.stringify(str + '\n//@ sourceURL=' + path);
    buf += '\n));';
  });
  return buf;
};

var repeat = function(str, num) {
  return new Array( num + 1 ).join(str);
};

exports.css = function(css) {
  var buf = '';

  _.each(css, function(str, path){
    var dashes = repeat('-', path.length);
    buf += '\n/* ' + dashes + ' */\n';
    buf += '/* ' + path + ' */';
    buf += '\n/* ' + dashes + ' */\n';
    buf += str;
    buf += '\n';
  });
  
  return buf;
};

/**
 * Require a module.
 */

var require = exports.require = function require(p){
  var path = require.resolve(p),
      mod = require.modules[path],
      rcss = /\.(css|styl|less|sass)$/;

  if(require.aliases[p]) return require.aliases[p];

  // Is this a CSS require?
  if(!mod && rcss.test(p)) return;
  if (!mod) throw new Error('failed to require "' + p + '"');
  if (!mod.exports) {
    mod.exports = {};
    mod.call(mod.exports, mod, mod.exports, require.relative(path));
  }
  return mod.exports;
};

/**
 * Resolve module path.
 */

var resolve = exports.resolve = function(path){
  var orig = path,
      reg = path + '.js',
      index = path + '/index.js';
  return require.modules[reg] && reg || require.modules[index] && index || orig;
};

/**
 * Return relative require().
 */

var relative = exports.relative = function(parent) {
  var req = function(p){
    if ('.' != p.charAt(0)) return require(p);
    
    var path = parent.split('/'),
        segs = p.split('/');
    path.pop();
    
    for (var i = 0; i < segs.length; i++) {
      var seg = segs[i];
      if ('..' == seg) path.pop();
      else if ('.' != seg) path.push(seg);
    }

    return require(path.join('/'));
  };

  req.alias = function(to, from) {
    require.aliases[to] = from;
  };

  return req;
};

/**
 * Register a module.
 */

var register = exports.register = function(path, fn){
  require.modules[path] = fn;
};
