import { Challenge } from '../challenge';
import { Level } from '../level';
import { Video } from '../video';
import { Minigame } from '../minigame';
import { Slide } from '../slide';

const defineCourseAssociations = () => {
  Challenge.belongsTo(Level, { foreignKey: 'levelId' });
  Challenge.hasMany(Video, { foreignKey: 'challengeId' });
  Challenge.hasMany(Minigame, { foreignKey: 'challengeId' });
  Challenge.hasMany(Slide, { foreignKey: 'challengeId' });
};

export default defineCourseAssociations;
