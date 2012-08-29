
// CommonJS require()

function require(p){
  var path = require.resolve(p),
      mod = require.modules[path];
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


require.register("/Users/mattym/Desktop/scotch/example/views/index.js", Function(
["module", "exports", "require"],
"var a = require('/ui/a/a.js');\n// console.log(require('underscore'));\n// console.log(require('jquery-browserify'));\nconsole.log('hi world!');\n//@ sourceURL=/Users/mattym/Desktop/scotch/example/views/index.js"
));
require.register("/Users/mattym/Desktop/scotch/example/ui/a/a.js", Function(
["module", "exports", "require"],
"require('./test.css');\nconsole.log(require('../b/hello.mu'));\nconsole.log(require('./blah.coffee'));\n\n// var person = require('./person.json');\n// console.log(person);\nrequire('../b/css.styl');\n// console.log(require('/ui/b/b.coffee'));\n// module.exports = require('/models/model.js');\n\n\n//@ sourceURL=/Users/mattym/Desktop/scotch/example/ui/a/a.js"
));
require.register("/Users/mattym/Desktop/scotch/example/ui/b/hello.mu", Function(
["module", "exports", "require"],
"function (fn, me) {\n  return function() { return fn.apply(me, arguments); };\n};var Hogan = Hogan || require(\"hogan.js\");var tpl = new Hogan.Template( function(c,p,i){var _=this;_.b(i=i||\"\");_.b(\"hello \");_.b(_.v(_.f(\"planet\",c,p,0)));_.b(\"!\");return _.fl();;} );module.exports = __bind(tpl.render, tpl)\n//@ sourceURL=/Users/mattym/Desktop/scotch/example/ui/b/hello.mu"
));
require.register("/Users/mattym/Desktop/scotch/example/ui/a/blah.coffee", Function(
["module", "exports", "require"],
"(function() {\n  module.exports = function(a, b, c) {\n    return console.log(a);\n  };\n}).call(this);\n\n//@ sourceURL=/Users/mattym/Desktop/scotch/example/ui/a/blah.coffee"
));

require.register("./index.js", function(module, exports, require) { module.exports = require("/Users/mattym/Desktop/scotch/example/views/index.js"); });
