var express = require('express'),
    cons = require('consolidate'),
    scotch = require('../');
    app = express();

app.set('views', __dirname);
var root = __dirname;

app.engine('html', scotch(root, {}, cons.hogan));

app.use(express['static'](__dirname));

app.get('/', function(req, res) {
  res.render('views/index.html', {
    hello : 'hi'
  });
});

app.listen(3000);
console.log("Listening on port 3000.");