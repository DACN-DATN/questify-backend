import { User } from '../user';
import { AdminUser } from '../admin-user';
import { AdminCourse } from '../admin-course';
import { AdminIslandTemplate } from '../admin-island-template';
import { Course } from '../course';
import { IslandTemplate } from '../island-template';

const defineUserAssociations = () => {
  // Existing One-to-Many relationships
  // User as admin performing actions
  User.hasMany(AdminUser, {
    foreignKey: 'adminId',
    as: 'adminActions',
  });

  // User as target of admin actions
  User.hasMany(AdminUser, {
    foreignKey: 'userId',
    as: 'receivedAdminActions',
  });

  // User as admin performing course actions
  User.hasMany(AdminCourse, {
    foreignKey: 'adminId',
    as: 'courseActions',
  });

  // User as admin performing island template actions
  User.hasMany(AdminIslandTemplate, {
    foreignKey: 'adminId',
    as: 'islandTemplateActions',
  });

  // Super Many-to-Many relationships
  // User to User Many-to-Many (admin to normal users)
  User.belongsToMany(User, {
    through: AdminUser,
    foreignKey: 'adminId',
    otherKey: 'userId',
    as: 'managedUsers',
  });

  User.belongsToMany(User, {
    through: AdminUser,
    foreignKey: 'userId',
    otherKey: 'adminId',
    as: 'adminUsers',
  });

  // User to Course Many-to-Many (admin to courses)
  User.belongsToMany(Course, {
    through: AdminCourse,
    foreignKey: 'adminId',
    otherKey: 'courseId',
    as: 'managedCourses',
  });

  // User to IslandTemplate Many-to-Many
  User.belongsToMany(IslandTemplate, {
    through: AdminIslandTemplate,
    foreignKey: 'adminId',
    otherKey: 'islandTemplateId',
    as: 'managedTemplates',
  });
};

export default defineUserAssociations;
