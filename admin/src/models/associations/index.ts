import defineUserAssociations from './user.associations';
import defineCourseAssociations from './course.associations';
import defineIslandTemplateAssociations from './islandTemplate.associations';
import defineAdminUserAssociations from './adminUser.associations';
import defineAdminCourseAssociations from './adminCourse.associations';
import defineAdminIslandTemplateAssociations from './adminIslandTemplate.associations';

export const defineAssociations = () => {
  defineUserAssociations();
  defineCourseAssociations();
  defineIslandTemplateAssociations();
  defineAdminUserAssociations();
  defineAdminCourseAssociations();
  defineAdminIslandTemplateAssociations();
};

defineAssociations();
