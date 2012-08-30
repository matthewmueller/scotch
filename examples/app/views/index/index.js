// Set up the hogan.js alias explicitly
require.alias('hogan.js', require('/vendor/hogan.js'));
require.alias('underscore', require('/vendor/underscore.js'));
require.alias('backbone', require('/vendor/backbone.js'));

require('./index.styl');

var $ = require('/vendor/jquery');
console.log($);

$(function() {
  $('h2').fadeOut('slow');
});
// var User = require('/models/user');

var List = require('/ui/list/list.js'),
    list = new List();

document.getElementById('template').innerHTML = list.template({ planet : 'venus' });