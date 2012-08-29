/**
 * Module dependencies
 */

var express = require('express'),
    scotch = require('../../'),
    cons = require('consolidate'),
    join = require('path').join,
    port = process.argv[2] || 8080,
    app = express();

/**
 * Configuration
 */

app.configure(function() {
  app.set('view engine', 'html');
  app.use(express['static'](join(__dirname, 'build')));
});

app.configure('development', function() {
  app.engine('html', scotch(cons.hogan, {
    root : join(__dirname),
    build : join(__dirname, 'build')
  }));
});

app.configure('production', function() {
  app.engine('html', cons.hogan);
});

/**
 * Routing
 */

var index = require('./routes/index');

app.get('/', index.index);


/**
 * Binding the server
 */

app.listen(port, function() {
  console.log('Listening on port', port);
});
