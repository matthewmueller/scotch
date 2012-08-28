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
      out = [];

  str = hogan.compile(str, { asString : true });

  out[out.length] = utils.bind;
  out[out.length] = 'var Hogan = Hogan || require("hogan.js")';
  out[out.length] = 'var tpl = new Hogan.Template( ' + str + ' )';
  out[out.length] = 'module.exports = __bind(tpl.render, tpl)';

  return out.join(';');
};

//////////////////
// JS Compilers //
//////////////////

// JSON
exports.json = function(str) {
  var out = [];

  str =  utils.escapeJSON(str);
  out[out.length] = 'module.exports = (function() {';
  out[out.length] = '\ttry { JSON.parse(' + str + '); }';
  out[out.length] = '\tcatch(e) { throw e; }';
  out[out.length] = '})();';

  return out.join('\n');
};

// COFFEE-SCRIPT
exports.coffee = function(str) {
  var coffee = requires.coffee || (requires.coffee = require('coffee-script'));
      out = '';

  out = coffee.compile(str);

  return out;
};