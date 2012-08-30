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
  var self = this;
  this.start = (new Date()).getTime();
  self.js = {};
  self.css = {};

  self.main = path.replace(extname(path), '.js');

  self.walk(self.main, function(err) {
    if(err) return fn(err);
    self.wrap(null, function(err) {
      if(err) return fn(err);
      console.log(((new Date()).getTime() - self.start) + ' ms');
      return self.engine(path, locals, fn);
    });
  });
};

/**
 * Walk up and down the javascript requires
 * @param  {string}   src
 * @param  {Function} done
 */

var walk = exports.walk = function(src, done) {
  var self = this,
      js = self.js,
      css = self.css,
      aliases = self.aliases,
      detective = self.detective;
      
  // Read in the source and add it
  fs.readFile(src, 'utf8', function(err, str) {
    if(err) return done.call(self, err);
    var compiler = compilers[extname(src).substring(1)];

    // Add it
    js[src] = (compiler) ? compiler.call(self, str, src) : str;
    if(!js[src]) delete js[src];

    var reqs = detective(str),
        pending = reqs.length;

    if(!pending) return done.call(self, null);

    reqs.forEach(function(req) {
      req = (aliases[req]) ? aliases[req] : req;

      // If we don't have an extension, add .js
      req = (!extname(req)) ? req + '.js' : req;

      // Resolve the pathname
      req = self.resolve(req, src);

      // If we already have it, fuggetuhboutit
      if(js[req]) return next();

      // Build it
      self.walk(req, next);
    });

    function next(err) {
      if(err) return done.call(self, err);
      else if(!--pending) return done.call(self, null);
    }

  });
};

/**
 * Wrap our objects in `require`
 * @param  {error|string} err
 */

exports.wrap = function(err, fn) {
  if(err) console.log('err though');

  var self = this,
      js = self.js = self.relativize(self.js),
      css = self.css = self.relativize(self.css),
      base = basename(self.main, extname(self.main)),
      pending = 2;

  js = wrap.js(js);
  js += '\nrequire("' + self.main.replace(self._root, '') + '");\n';
  // Crude alias to main
  css = wrap.css(css);

  // Create the build directory if it doesn't already exist
  mkdirp(self._build, function(err) {
    if(err) return fn(err);

    var js_stream = fs.createWriteStream(join(self._build, base, 'scotch.js')),
        css_stream = fs.createWriteStream(join(self._build, base, 'scotch.css'));

    // Write the JS and CSS
    js_stream.write(js);
    css_stream.write(css);

    js_stream.end(done);
    css_stream.end(done);
  });

  function done() {
    if(!--pending) {
      return fn(null);
    }
  }
};

/**
 * Relativize the js/css keys before wrapping
 * @param  {object} obj
 * @api private
 * @return {object}
 */

var relativize = exports.relativize = function(obj) {
  var root = this._root;

  Object.keys(obj).forEach(function(key) {
    obj[key.replace(root, '')] = obj[key];
    delete obj[key];
  });

  return obj;
};

/**
 * Resolve the file path
 *
 * @param  {string} req
 * @param  {string} src
 * @api private
 * @return {str}
 */

var resolve = exports.resolve = function(req, src) {
  if(req[0] === '/') {
    return join(this._root, req);
  } else if(/^\.\//.test(req) || /^\.{2}/.test(req)) {
    return join(dirname(src), req);
  } else {
    // return join(paths.node_modules, req);
  }
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


