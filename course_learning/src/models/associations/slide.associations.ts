import { Level } from '../level';
import { Slide } from '../slide';
import { SlideTemplate } from '../slideTemplate';

const defineSlideAssociations = () => {
  Slide.belongsTo(Level, { foreignKey: 'levelId' });
  Slide.belongsTo(SlideTemplate, { foreignKey: 'slideTemplateId' });
};

export default defineSlideAssociations;
