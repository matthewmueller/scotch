/**
 * Module dependencies
 */

var fs = require('fs'),
    path = require('path'),
    join = path.join,
    extname = path.extname,
    dirname = path.dirname,
    basename = path.basename,
    compilers = require('./compilers'),
    wrap = require('./wrap'),
    detective = require('detective'),
    deputy = require('deputy');

/**
 * Export scotch
 *
 * @param  {fn} renderFn original templating function
 * @param  {obj} opts    pathes and options
 * @return {fn} render function signature
 */

scotch = module.exports = function(renderFn, opts) {
  opts.home = process.env.HOME || process.env.USERPROFILE;
  var detective = (opts.cache !== false)
                    ? deputy(join(opts.home, opts.cache || '.scotch/cache.json'))
                    : detective;

  return function(path, locals, fn) {
    var ext = extname(path),
        main = path.replace(ext, '.js'),
        base = basename(path, ext),
        css = base + '.css',
        js = base + '.js',
        js_stream = fs.createWriteStream(join(opts.build, js)),
        css_stream = fs.createWriteStream(join(opts.build, css)),
        pending = 2;

    build(main, opts, function(err, js, css) {
      if(err) throw new Error(err);

      js = wrap.js(js);
      // Crude alias to main
      js += '\n\nrequire.register("./' + basename(main) + '", function(module, exports, require) { module.exports = require("' + main + '"); });\n';
      
      // Relativize the css keys
      Object.keys(css).forEach(function(key) {
        css[key.replace(opts.root, '')] = css[key];
        delete css[key];
      });

      css = wrap.css(css);

      // Write the JS and CSS
      js_stream.write(js);
      css_stream.write(css);

      js_stream.end(done);
      css_stream.end(done);
    });

    function done() {
      if(!--pending) {
        return renderFn(path, locals, fn);
      }
    }
  };
};

/**
 * Build the javascript and css
 *
 * @param  {string}   src
 * @param  {obj}   paths
 * @param  {fn(err, js, css)} done
 * @param  {obj}   js   private
 * @param  {css}   css   private
 */

var build = scotch.build = function(src, paths, done, js, css) {
  js = js || {};
  css = css || {};
  fs.readFile(src, 'utf8', read);

  function read(err, str) {
    if(err) return done(err);
    var compiler = compilers[extname(src).substring(1)];

    // Add it
    js[src] = (compiler) ? compiler(str, src, css, paths) : str;
    if(!js[src]) delete js[src];

    var reqs = detective(str),
        pending = reqs.length;

    if(!pending) return done(null, js, css);

    reqs.forEach(function(req) {
      // If we don't have an extension, add .js
      req = (!extname(req)) ? req + '.js' : req;

      // Resolve the pathname
      req = resolve(req, src, paths);

      // If we already have it, fuggetuhboutit
      if(js[req]) return next();

      // Build it
      build(req, paths, next, js, css);
    });

    function next(err) {
      if(err) return done(err);
      else if(!--pending) return done(null, js, css);
    }
  }
};

/**
 * Resolve the file path
 *
 * @param  {string} req
 * @param  {string} src
 * @param  {obj} paths
 * @return {str}
 */

var resolve = scotch.resolve = function(req, src, paths) {
  if(req[0] === '/') {
    return join(paths.root, req);
  } else if(/^\.\//.test(req) || /^\.{2}/.test(req)) {
    return join(dirname(src), req);
  } else {
    return join(paths.node_modules, req);
  }
};

// // Example
// var opts = {
//   root : join(__dirname, '../example'),
//   node_modules : join(__dirname, '../node_modules'),
//   build : join(__dirname, '../example/build')
// };

// var tpl = function(path, options, fn) {
//   console.log(path);
// };

// scotch(tpl, opts)(join(__dirname, '../example/views/index.html'));
