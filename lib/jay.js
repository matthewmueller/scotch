/**
 * Module dependencies
 */

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    extname = path.extname,
    dirname = path.dirname,
    basename = path.basename,
    mkdirp = require('mkdirp'),
    compilers = require('./compilers'),
    wrap = require('./wrap'),
    detective = require('detective'),
    deputy = require('deputy2');

/**
 * Create a `jay` instance
 */

var create = exports.create = function() {
  var jay = function() { return init.apply(jay, arguments); };
  
  // Inherit from `exports`
  jay.__proto__ = exports;

  // Setup some addition vars
  jay.aliases = {};

  return jay;
};

/**
 * Initialize a `jay` instance
 * @param {Function} engine
 * @api private
 */

var init = function(engine) {
  // Slide through if we're in production
  if(process.env.NODE_ENV === 'production') return renderFn;

  if(!this._root) throw new Error('jay requires a root to be specified');

  // Render engine
  this.engine = engine;

  // Home directory
  var home = process.env.HOME || process.env.USERPROFILE;

  // Directory setup
  this._build = this._build || join(this._root, 'build');
  this._cache = this._cache || '.scotch/cache.json';

  // Set up deputy unless we turn off caching
  this.detective = (this._cache !== false)
                    ? deputy(join(home, this._cache))
                    : detective;
  
  // Bind `out` to `this`
  var self = this;
  return function() { return self.out.apply(self, arguments); };
};

/**
 * Output the results
 * @param  {Function} fn
 * @api private
 */

var out = exports.out = function(path, locals, fn) {
  this.js = {};
  this.css = {};

  var ext = extname(path),
      main = path.replace(ext, '.js');

  this.walk(main, this.wrap);
};

/**
 * Walk up and down the javascript requires
 * @param  {string}   src
 * @param  {Function} done
 */

var walk = exports.walk = function(src, done) {
  var js = this.js,
      css = this.css,
      aliases = this.aliases,
      detective = this.detective;
      
  // Read in the source and add it
  fs.readFile(src, 'utf8', function(err, str) {
    if(err) return done(err);
    var compiler = compilers[extname(src).substring(1)];

    // Add it
    js[src] = (compiler) ? compiler(str, src, css, paths) : str;
    if(!js[src]) delete js[src];

    var reqs = detective(str),
        pending = reqs.length;

    if(!pending) return done(null, js, css);

    reqs.forEach(function(req) {
      req = (aliases[req]) ? aliases[req] : req;

      // If we don't have an extension, add .js
      req = (!extname(req)) ? req + '.js' : req;

      // Resolve the pathname
      req = resolve(req, src, paths);

      // If we already have it, fuggetuhboutit
      if(js[req]) return next();

      // Build it
      this.walk(req, next);
    });

  });

  function next() {
    if(err) return done(err);
    else if(!--pending) return done(null);
  }
};

var wrap = exports.wrap = function(err) {
  if(err) console.log('donezilla, err though');
};

/**
 * API
 */

/**
 * Alias a module
 * @param  {string} to
 * @param  {string} from
 * @return {object} jay
 */

var alias = exports.alias = function(to, from) {
  this.aliases[to] = from;
  return this;
};

/**
 * Set the root directory
 * @param  {string} root
 * @return {object} jay
 */

var root = exports.root = function(root) {
  this._root = root;
  return this;
};

/**
 * Set the build directory
 * @param  {string} build
 * @return {object} jay
 */

var build = exports.build = function(build) {
  this._build = build;
  return this;
};

/**
 * Set the cache directory, or no cache if false
 * @param  {string|boolean} cache
 * @return {object} jay
 */

var cache = exports.cache = function(cache) {
  this._cache = cache;
  return this;
};

module.exports = create();


