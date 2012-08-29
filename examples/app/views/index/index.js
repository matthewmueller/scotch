// Set up the hogan.js alias explicitly
require.alias('hogan.js', require('/vendor/hogan.js'));

require('./index.styl');

var jquery = require('/vendor/jquery');

var List = require('/ui/list/list.js'),
    list = new List();

console.log(list.template({
  planet : "venus"
}));
