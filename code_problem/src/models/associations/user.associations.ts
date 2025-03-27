import { User } from '../user';
import { Progress } from '../progress';

const defineUserAssociations = () => {
  User.hasMany(Progress, { foreignKey: 'userId' });
};

export default defineUserAssociations;
