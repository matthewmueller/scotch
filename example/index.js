var express = require('express'),
    cons = require('consolidate'),
    scotch = require('../')(__dirname);
    app = express();

app.set('views', __dirname);
app.engine('html', function(path, options, fn) {
  scotch.render(path, options, function(err, str) {
    console.log(err);
    console.log(str);
  });
});

app.use(express['static'](__dirname));

app.get('/', function(req, res) {
  res.render('views/index.html');
});

app.listen(3000);
console.log("Listening on port 3000.");