import { IslandTemplate } from '../island-template';
import { AdminIslandTemplate } from '../admin-island-template';
import { User } from '../user';

const defineIslandTemplateAssociations = () => {
  // Existing One-to-Many relationship
  IslandTemplate.hasMany(AdminIslandTemplate, {
    foreignKey: 'islandTemplateId',
    as: 'adminActions',
  });

  // Super Many-to-Many relationship
  IslandTemplate.belongsToMany(User, {
    through: AdminIslandTemplate,
    foreignKey: 'islandTemplateId',
    otherKey: 'adminId',
    as: 'admins',
  });
};

export default defineIslandTemplateAssociations;
