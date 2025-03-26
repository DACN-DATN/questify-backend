import { Video } from '../video';
import { Level } from '../level';

const defineVideoAssociations = () => {
  Video.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineVideoAssociations;
