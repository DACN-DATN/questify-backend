import { Level } from '../level';
import { Progress } from '../progress';
import { Testcase } from '../testcase';

const defineLevelAssociations = () => {
  Level.belongsTo(Progress, { foreignKey: 'progressId' });
  Level.hasMany(Testcase, { foreignKey: 'levelId' });
};

export default defineLevelAssociations;
