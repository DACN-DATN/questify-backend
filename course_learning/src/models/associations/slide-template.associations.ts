import { Slide } from '../slide';
import { SlideTemplate } from '../slide-template';

const defineSlideTemplateAssociations = () => {
  SlideTemplate.hasMany(Slide, { foreignKey: 'slideTemplateId' });
};

export default defineSlideTemplateAssociations;
