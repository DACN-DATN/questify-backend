import { AdminIslandTemplate } from '../admin-island-template';
import { User } from '../user';
import { IslandTemplate } from '../island-template';

const defineAdminIslandTemplateAssociations = () => {
  AdminIslandTemplate.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin',
  });

  AdminIslandTemplate.belongsTo(IslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'islandTemplate',
  });
};

export default defineAdminIslandTemplateAssociations;
