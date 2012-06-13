require('./css.styl');

var jquery = require('../../support/jquery.js');

var Hogan = require('../../support/hogan.js');
console.log(require('./hello.jst')({ planet : "Mars" }));
