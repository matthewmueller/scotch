require('./css.styl');

jquery = require('../../support/jquery.js');

Hogan = require('../../support/hogan.js');
console.log(require('./hello.mu')({ planet : "Mars" }));

module.exports = 'hi from cs!'