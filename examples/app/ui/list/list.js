var list = module.exports = function() {
  console.log('creating list');
};

/**
 * List style
 */
require('./list.styl');
// console.log(require('./helper.json'));
/**
 * List template
 */
list.prototype.template = require('./list.mu');

