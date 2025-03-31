import { IslandTemplate } from '../island-template';
import { AdminIslandTemplate } from '../admin-island-template';

const defineIslandTemplateAssociations = () => {
  IslandTemplate.hasMany(AdminIslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'adminActions',
  });
};

export default defineIslandTemplateAssociations;
