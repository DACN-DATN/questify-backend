import { Progress } from '../progress';
import { User } from '../user';
import { Level } from '../level';

const defineProgressAssociations = () => {
  Progress.belongsTo(User, { foreignKey: 'userId' });
  Progress.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineProgressAssociations;
