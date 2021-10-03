const path = require("path");
const sanitize = require("sanitize-filename");

const MovieHelper = require("./movie/movieHelper");
const ShowHelper = require("./show/showHelper");

const { recursive } = require('./recursive');

const MOVIE_KEY = 'movie';
const SHOW_KEY = 'show';

class FileManager {

  constructor(wss, sourceDir, movieTargetDir, showTargetDir) {
    this.wss = wss;
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
  const sanitizedName = sanitize(name, { replacement: '.' }) || '';
  const normalizedName = sanitizedName.split(' ')
    .map(word => `${word[0].toUpperCase()}${word.substring(1)}`)
    .join(' ');
  const type = this.types[typeName];

  let error = 0;
  const files = sources.map(source => {
    try {
      const targetName = type.buildTargetName(normalizedName, source, option);
      const target = path.parse(targetName);

      return { source, target };
    } catch (e) {
      error += 1;
      return { source, error: e.message }
    }
  });

  return { normalizedName, files, error };
};


FileManager.prototype.move = function ({ files = [] }) {
  const total = files.length;
  files.forEach((file, index) => {
    setTimeout(this.wss.send, 1000 * (index + 1), 'RENAME_PROCESSING', { done: index + 1, total });
  });

  setTimeout(this.wss.send, 1000 * (total + 1), 'RENAME_DONE');
  return { done: 0, total };
};

module.exports = FileManager;
