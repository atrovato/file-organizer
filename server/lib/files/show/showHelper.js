const path = require('path');

const SeasonHelper = require('./seasonHelper');
const EpisodeHelper = require('./episodeHelper');

const SEASON_MODE = 'season';
const EPISODE_MODE = 'episode';
const DEFAULT_MODE = SEASON_MODE;

class ShowHelper {

  constructor(targetDir) {
    this.label = 'Série';
    this.options = [
      {
        key: SEASON_MODE,
        label: 'Avec saison(s)'
      },
      {
        key: EPISODE_MODE,
        label: 'Sans saison'
      }
    ];
    this.helpers = {
      [SEASON_MODE]: new SeasonHelper(),
      [EPISODE_MODE]: new EpisodeHelper(),
    }

    this.targetDir = targetDir;
  }

}

ShowHelper.prototype.buildTargetName = function (name, source, showMode = DEFAULT_MODE) {
  const helper = this.helpers[showMode];

  if (!helper) {
    throw new Error(`'${showMode}' show mode not managed`);
  } else if (!helper.test(source.name)) {
    throw new Error(`'${source.name}' doesn't match '${showMode}' show mode`);
  }

  const target = helper.buildTargetName(name, source);
  return `${this.targetDir}${path.sep}${target}`;
};

module.exports = ShowHelper;
