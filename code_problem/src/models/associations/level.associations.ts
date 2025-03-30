import { Level } from '../level';
import { User } from '../user';
import { CodeProblem } from '../codeProblem';
import { UserLevel } from '../userLevel';

const defineLevelAssociations = () => {
  Level.hasMany(CodeProblem, { foreignKey: 'levelId' });
  Level.belongsToMany(User, {
    through: UserLevel,
    foreignKey: 'levelId',
    otherKey: 'studentId',
    as: 'students',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineLevelAssociations;
