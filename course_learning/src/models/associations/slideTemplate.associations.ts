import { Slide } from '../slide';
import { SlideTemplate } from '../slideTemplate';

const defineSlideTemplateAssociations = () => {
  SlideTemplate.hasMany(Slide, { foreignKey: 'slideTemplateId' });
};

export default defineSlideTemplateAssociations;
