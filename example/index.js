var express = require('express'),
    cons = require('consolidate'),
    scotch = require('../'),
    app = express();

app.engine('html', cons.hogan);

app.use(scotch('./ui'));

app.get('/', function(req, res) {
  res.render('index.html');
});

app.listen(8080);
console.log("Listening on port 8080.");