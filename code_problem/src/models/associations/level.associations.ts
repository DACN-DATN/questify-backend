import { Level } from '../level';
import { User } from '../user';
import { CodeProblem } from '../code-problem';
import { UserLevel } from '../user-level';

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
