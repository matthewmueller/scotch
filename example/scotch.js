
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


require.register("/views/index.js", function(module, exports, require){
var a = require('/ui/a/a.js');

console.log('hi world!');
}); // module: /views/index.js

require.register("/ui/a/a.js", function(module, exports, require){
require('./test.css');
require('./blah.coffee');

var person = require('./person.json');
console.log(person);
module.exports = require('../../models/model.js');


}); // module: /ui/a/a.js

require.register("/ui/a/blah.coffee", function(module, exports, require){
module.exports = 'lhhaahha!'
}); // module: /ui/a/blah.coffee

require.register("/ui/a/person.json", function(module, exports, require){
module.exports = JSON.parse("{\n  \"first\" : \"Matt\",\n  \"last\" : \"Mueller\",\n  \"phone\" : \"2625012161\",\n  \"business\" : \"Matt's Cafe\"\n}");
}); // module: /ui/a/person.json

require.register("/models/model.js", function(module, exports, require){
module.exports = 'hi from model';
}); // module: /models/model.js
