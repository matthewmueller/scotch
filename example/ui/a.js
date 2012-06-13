require('./css.styl');

// require('./blah.coffee');
var Hogan = require('../support/hogan.js');
console.log(require('./hello.jst')({ planet : "Mars" }));

module.exports = require('../models/model.js');