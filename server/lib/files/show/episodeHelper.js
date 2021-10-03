const path = require('path');

class EpisodeHelper {

  constructor() {
    this.pattern = /(\d+)/i;
  }
}

EpisodeHelper.prototype.test = function (name) {
  return this.pattern.test(name);
}

EpisodeHelper.prototype.buildTargetName = function (name, source) {
  const [, episode] = source.name.match(this.pattern);
  return `${name}${path.sep}${name} - E${episode.padStart(3, 0)}${source.ext}`;
}

module.exports = EpisodeHelper;
