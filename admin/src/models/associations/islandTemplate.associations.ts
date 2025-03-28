import { IslandTemplate } from '../islandTemplate';
import { AdminIslandTemplate } from '../adminIslandTemplate';

const defineIslandTemplateAssociations = () => {
  IslandTemplate.hasMany(AdminIslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'adminActions'
  });
};

export default defineIslandTemplateAssociations;