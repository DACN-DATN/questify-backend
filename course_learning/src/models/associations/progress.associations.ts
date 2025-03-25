import { Course } from '../course';
import { Progress } from '../progress';
import { Feedback } from '../feedback';
import { User } from '../user';
import { Island } from '../island';
import { Level } from '../level';

const defineProgressAssociations = () => {
  Progress.hasOne(Feedback, { foreignKey: 'progressId' });
  Progress.belongsTo(User, { foreignKey: 'userId' });
  Progress.belongsTo(Course, { foreignKey: 'courseId' });
  Progress.belongsTo(Island, { foreignKey: 'islandId' });
  Progress.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineProgressAssociations;
