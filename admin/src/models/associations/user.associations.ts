import { User } from '../user';
import { AdminUser } from '../admin-user';
import { AdminCourse } from '../admin-course';
import { AdminIslandTemplate } from '../admin-island-template';
import { Course } from '../course';

const defineUserAssociations = () => {
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

  // User as teacher creating courses
  User.hasMany(Course, {
    foreignKey: 'teacherId',
    as: 'courses',
  });
};

export default defineUserAssociations;
