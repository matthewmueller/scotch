
// CommonJS require()

function require(p){
  var path = require.resolve(p),
      mod = require.modules[path],
      rcss = /\.(css|styl|less|sass)$/;

  // Is this a CSS require?
  if(!mod && rcss.test(p)) return;

  if (!mod) throw new Error('failed to require "' + p + '"');
  if (!mod.exports) {
    mod.exports = {};
    mod.call(mod.exports, mod, mod.exports, require.relative(path));
  }
  return mod.exports;
}

require.modules = {};

require.resolve = function (path){
  var orig = path,
      reg = path + '.js',
      index = path + '/index.js';
  return require.modules[reg] && reg || require.modules[index] && index || orig;
};

require.register = function (path, fn){
  require.modules[path] = fn;
};

require.relative = function (parent) {
  return function(p){
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
};


require.register("/views/index/index.js", Function(
["module", "exports", "require"],
"require('./index.styl');\n\nvar jquery = require('/vendor/jquery');\n\nvar list = require('../../ui/list/list.js');\n\nconsole.log(list);\n//@ sourceURL=/views/index/index.js"
));
require.register("/vendor/jquery.js", Function(
["module", "exports", "require"],
"module.exports = 'hi there';\n//@ sourceURL=/vendor/jquery.js"
));
require.register("/ui/list/list.js", Function(
["module", "exports", "require"],
"var list = module.exports = function() {\n  console.log('creating list');\n};\n\n/**\n * List style\n */\n// require('./list.styl');\n// alert(require('./helper.json'));\n/**\n * List template\n */\n// list.prototype.template = require('./list.mu');\n\n\n//@ sourceURL=/ui/list/list.js"
));

(function() {
require('./index.styl');

var jquery = require('/vendor/jquery');

var list = require('../../ui/list/list.js');

console.log(list);
}());