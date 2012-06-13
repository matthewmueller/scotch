var css = exports.css = [];

exports.css = function(str) {
  css[css.length] = str;
  return '';
};

exports.styl = function(str) {
  stylus = require('stylus');
  stylus(str).render(function(err, out) {
    css[css.length] = out;
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
  out += ';var tpl = new Hogan.Template( ' + str + ' );';
  out += 'module.exports = __bind(tpl.render, tpl);';

  return out;
};