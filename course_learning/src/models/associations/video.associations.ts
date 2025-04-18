import { Video } from '../video';
import { Challenge } from '../challenge';

const defineVideoAssociations = () => {
  Video.belongsTo(Challenge, { foreignKey: 'challengeId' });
};

export default defineVideoAssociations;
