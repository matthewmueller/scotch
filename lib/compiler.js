var requires = {};

exports.css = function(str, file, css) {
  css[file] = str;
  return '';
};

exports.styl = function(str, file, css, options) {
  stylus = requires.stylus || (requires.stylus = require('stylus')),
  styl = stylus(str);

  styl
    .set('filename', file)
    .include(options.root);

  // Try addng nib
  try {
    nib = requires.nib || (requires.nib = require('nib'));
    styl.use(nib());
  } catch(e) {}

  styl.render(function(err, out) {
    css[file] = out;
  });

  return '';
};

exports.mu = function(str) {
  var hogan = requires.hogan || (requires.hogan = require('hogan.js'));
      out = '';

  str = hogan.compile(str, { asString : true });

  out += __bind;
  out += ';var Hogan = Hogan || require("hogan.js");';
  out += ';var tpl = new Hogan.Template( ' + str + ' );';
  out += 'module.exports = __bind(tpl.render, tpl);';

  return out;
};

exports.json = function(str) {
  str = escapeJSON(str);
  return 'module.exports = JSON.parse(' + str + ');';
};

function __bind(fn, me) {
  return function() { return fn.apply(me, arguments); };
}

/*
  Escape JSON
*/
function escapeJSON(json) {
  var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
  var meta = {    // table of character substitutions
              '\b': '\\b',
              '\t': '\\t',
              '\n': '\\n',
              '\f': '\\f',
              '\r': '\\r',
              '"' : '\\"',
              '\\': '\\\\'
            };

  escapable.lastIndex = 0;
  return escapable.test(json) ? '"' + json.replace(escapable, function (a) {
      var c = meta[a];
      return (typeof c === 'string') ? c
        : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
  }) + '"' : '"' + json + '"';

}