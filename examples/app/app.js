/**
 * Module dependencies
 */

var express = require('express'),
    jay = require('../../lib/jay'),
    cons = require('consolidate'),
    join = require('path').join,
    port = process.argv[2] || 8080,
    app = express();

/**
 * Configuration
 */

jay.root(__dirname)
   .alias('underscore', '/vendor/underscore.js');

app.configure(function() {
  app.set('view engine', 'html');
  app.use(express['static'](join(__dirname, 'build')));
});

app.configure('development', function() {
  app.engine('html', jay(cons.hogan));
});

app.configure('production', function() {
  app.engine('html', cons.hogan);
});

/**
 * Routing
 */

var index = require('./routes/index'),
    signup = require('./routes/signup');

// var template = require('./ui/list/list.mu');
// str = template({planet : 'earth'});
app.get('/', index.index);
app.get('/signup', signup.index);

/**
 * Binding the server
 */

app.listen(port, function() {
  console.log('Listening on port', port);
});
