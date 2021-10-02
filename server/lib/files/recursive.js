const fs = require('fs/promises');
const path = require('path');

const recursive = async (dir, result) => {
  const dirents = await fs.readdir(dir, { withFileTypes: true });

  for await (dirent of dirents) {
    const fileName = path.normalize(`${dir}${path.sep}${dirent.name}`);
    if (dirent.isDirectory()) {
      await recursive(fileName, result);
    } else if (dirent.isFile()) {
      result.push(path.parse(fileName));
    }
  }
}

module.exports = { recursive };
