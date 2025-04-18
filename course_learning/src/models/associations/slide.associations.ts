import { Challenge } from '../challenge';
import { Slide } from '../slide';
import { SlideTemplate } from '../slide-template';

const defineSlideAssociations = () => {
  Slide.belongsTo(Challenge, { foreignKey: 'challengeId' });
  Slide.belongsTo(SlideTemplate, { foreignKey: 'slideTemplateId' });
};

export default defineSlideAssociations;
