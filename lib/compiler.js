var style = exports.style = {};

exports.css = function(str, file) {
  style[file] = str;
  return '';
};

exports.styl = function(str, file) {
  stylus = require('stylus');
  stylus(str).render(function(err, out) {
    style[file] = out;
  });

  return '';
};

function __bind(fn, me) {
  return function() { return fn.apply(me, arguments); };
}

exports.hogan = function(str) {
  var hogan = require('hogan.js'),
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

/*
  Escape JSON
*/
var escapeJSON = function(json) {
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

};