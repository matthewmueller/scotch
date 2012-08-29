var express = require('express'),
    scotch = require('../../'),
    cons = require('consolidate'),
    join = require('path').join,
    port = process.argv[2] || 8080,
    app = express();

var opts = {
  root : join(__dirname),
  build : join(__dirname, 'build')
};

app.use(express['static'](join(__dirname, 'build')));

app.engine('html', scotch(cons.hogan, opts));
app.set('view engine', 'html');

app.configure(function() {
  app.use(express['static'](__dirname));
});

app.get('/', function(req, res) {
  res.render('index/index', {
    title : 'Welcome to scotch'
  });
});

app.listen(port);
console.log('Listening on port', port);
