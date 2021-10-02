const { recursive } = require('./recursive');

class FileManager {

  constructor(directory) {
    this.directory = directory;
  }

}

FileManager.prototype.list = async function () {
  const files = [];
  await recursive(this.directory, files);
  return { files };
};

module.exports = FileManager;
