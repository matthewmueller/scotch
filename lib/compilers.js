/**
 * Module dependencies
 */

var requires = {},
    utils = require('./utils');

///////////////////
// CSS Compilers //
///////////////////

// CSS
exports.css = function(str, file, css) {
  css[file] = str;
  return '';
};

// STYLUS
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
    if(err) console.error(err);
    css[file] = out;
  });

  return '';
};

////////////////////////
// Template Compilers //
////////////////////////

// HOGAN
exports.mu = function(str) {
  var hogan = requires.hogan || (requires.hogan = require('hogan.js'));
      out = '';

  str = str.trim();
  str = hogan.compile(str, { asString : true });

  out = utils.bind;
  out += ';var Hogan = Hogan || require("hogan.js");';
  out += ';var tpl = new Hogan.Template( ' + str + ' );';
  out += 'module.exports = __bind(tpl.render, tpl);';
  
  return out;
};

exports.jade = function(str) {
  var jade = requires.jade || (requires.jade = require('jade')),
      out = '';
  
  try {
    out = jade.compile(str);
  } catch(e) {
    console.error(e);
    return '';
  }

  return out;
};

//////////////////
// JS Compilers //
//////////////////

// JSON
exports.json = function(str) {
  var out = [];

  str =  utils.escapeJSON(str);
  out[out.length] = 'module.exports = (function() {';
  out[out.length] = 'try { return JSON.parse(' + str + '); }';
  out[out.length] = 'catch(e) { throw e; }';
  out[out.length] = '})();';

  return out.join('');
};

// COFFEESCRIPT
exports.coffee = function(str) {
  var coffee = requires.coffee || (requires.coffee = require('coffee-script'));
      out = '';

  out = coffee.compile(str);

  return out;
};
