const fs = require('fs');
module.exports.requireCurrentDir = function (mod) {
  return fs
    .readdirSync(mod.path)
    .filter((file) => !mod.filename.endsWith(file))
    .map((file) => mod.require('./' + file));
};
