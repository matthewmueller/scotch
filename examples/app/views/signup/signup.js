require.alias('hogan.js', require('/vendor/hogan.js'));

var jquery = require('/vendor/jquery');


console.log(jquery);

var List = require('/ui/list/list.js'),
    list = new List();


document.getElementById('template').innerHTML = list.template({
  planet : 'mars'
});