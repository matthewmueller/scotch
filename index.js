var path = require('path'),
    join = path.join,
    resolve = path.resolve,
    dirname = path.dirname,
    // Get the script that called this module
    p = (module.parent) ? module.parent.id : process.argv[1];

exports = module.exports = require('./lib/scotch');

exports.node_modules = resolve(join(dirname(p), 'node_modules'));
exports.version = require('./package.json').version;