import { AdminIslandTemplate } from '../adminIslandTemplate';
import { User } from '../user';
import { IslandTemplate } from '../islandTemplate';

const defineAdminIslandTemplateAssociations = () => {
  AdminIslandTemplate.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin'
  });
  
  AdminIslandTemplate.belongsTo(IslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'islandTemplate'
  });
};

export default defineAdminIslandTemplateAssociations;