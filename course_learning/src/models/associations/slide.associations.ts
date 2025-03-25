import { Level } from '../level';
import { Slide } from '../slide';

const defineSlideAssociations = () => {
  Slide.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineSlideAssociations;
