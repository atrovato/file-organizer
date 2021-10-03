const path = require('path');

class EpisodeHelper {

  constructor() {
    this.patterns = [/S(\d+)EP?(\d+)/i, /(\d{,2})(\d\d)/i];
  }
}

EpisodeHelper.prototype.test = function (name) {
  return this.patterns.find(pattern => pattern.test(name)) !== undefined;
}

EpisodeHelper.prototype.buildTargetName = function (name, source) {
  const { name: sourceName } = source;
  const pattern = this.patterns.find(pattern => pattern.test(sourceName));

  const [, season, episode] = sourceName.match(pattern);
  const seasonName = `${name} - S${season.padStart(2, 0)}`;
  return `${name}${path.sep}${seasonName}${path.sep}${seasonName}E${episode.padStart(2, 0)}${source.ext}`;
}

module.exports = EpisodeHelper;
