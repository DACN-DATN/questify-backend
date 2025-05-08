import { Challenge } from '../challenge';
import { Level } from '../level';
import { Slide } from '../slide';

const defineChallengeAssociations = () => {
  Challenge.belongsTo(Level, { foreignKey: 'levelId' });
  Challenge.hasMany(Slide, { foreignKey: 'challengeId' });
};

export default defineChallengeAssociations;
