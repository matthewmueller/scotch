/*!
 * Scotch
 * Copyright(c) 2012 Matt Mueller <mattmuelle@gmail.com>
 * MIT Licensed
 */

exports = module.exports = require('./middleware');

exports.version = require('../package.json').version;

var plugins = exports.plugins = [];

exports.register = function(ext, fn) {
  ext = '.' + ext.replace(/^\./, '');
  plugins[plugins.length] = { ext : ext, fn : fn };
};