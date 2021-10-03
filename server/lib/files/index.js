const path = require("path");
const sanitize = require("sanitize-filename");

const MovieHelper = require("./movie/movieHelper");
const ShowHelper = require("./show/showHelper");

const { recursive } = require('./recursive');

const MOVIE_KEY = 'movie';
const SHOW_KEY = 'show';

class FileManager {

  constructor(sourceDir, movieTargetDir, showTargetDir) {
    this.sourceDir = sourceDir;

    this.types = {
      [MOVIE_KEY]: new MovieHelper(movieTargetDir),
      [SHOW_KEY]: new ShowHelper(showTargetDir),
    };
  }

}

FileManager.prototype.list = async function () {
  const files = [];
  await recursive(this.sourceDir, files);

  const types = Object.keys(this.types).map(key => {
    const { label, maxSelected, options } = this.types[key];
    return { key, label, maxSelected, options };
  });

  return { files, types };
};

FileManager.prototype.compute = function ({ type: typeName, name, sources = [], option }) {
  const normalizedName = sanitize(name);
  const type = this.types[typeName];

  let error = 0;
  const files = sources.map(source => {
    try {
      const targetName = type.buildTargetName(normalizedName, source, option);
      const target = path.parse(targetName);

      return { source, target };
    } catch (e) {
      error += 1;
      console.log(e);
      return { source, error: e.message }
    }
  });

  return { normalizedName, files, error };
};

module.exports = FileManager;
