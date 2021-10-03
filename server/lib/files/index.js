const { recursive } = require('./recursive');

const MOVIE_KEY = 'movie';
const SHOW_KEY = 'show';

class FileManager {

  constructor(sourceDir, movieTargetDir, showTargetDir) {
    this.sourceDir = sourceDir;

    this.types = {
      [MOVIE_KEY]: {
        label: 'Film',
        targetDir: movieTargetDir,
        maxSelected: 1
      },
      [SHOW_KEY]: {
        label: 'Série',
        targetDir: showTargetDir,
      },
    };
  }

}

FileManager.prototype.list = async function () {
  const files = [];
  await recursive(this.sourceDir, files);

  const types = Object.keys(this.types).map(key => {
    const type = this.types[key];
    return { ...type, key };
  });
  return { files, types };
};

module.exports = FileManager;
