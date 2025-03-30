import { UserLevel } from '../userLevel';
import { User } from '../user';
import { Level } from '../level';

const defineUserLevelAssociations = () => {
  UserLevel.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'student',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  UserLevel.belongsTo(Level, {
    foreignKey: 'levelId',
    as: 'level',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineUserLevelAssociations;