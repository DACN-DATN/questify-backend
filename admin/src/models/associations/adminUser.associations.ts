import { AdminUser } from '../adminUser';
import { User } from '../user';

const defineAdminUserAssociations = () => {
  AdminUser.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin'
  });
  
  AdminUser.belongsTo(User, {
    foreignKey: 'userId',
    as: 'targetUser'
  });
};

export default defineAdminUserAssociations;