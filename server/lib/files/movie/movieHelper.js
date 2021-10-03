const path = require("path");

class MovieHelper {

  constructor(targetDir) {
    this.label = 'Film';
    this.maxSelected = 1;

    this.targetDir = targetDir;
  }

}

MovieHelper.prototype.buildTargetName = function (name, source) {
  return `${this.targetDir}${path.sep}${name}${source.ext}`;
};

module.exports = MovieHelper;
