import defineCourseAssociations from './course.associations';
import defineIslandAssociations from './island.associations';
import defineLevelAssociations from './level.associations';
import definePrerequisiteIslandAssociations from './prerequisiteIsland.associations';
import defineReviewAssociations from './review.associations';
import defineUserCourseAssociations from './user-course.associations';
import defineUserAssociations from './user.associations';

export const defineAssociations = () => {
  defineCourseAssociations();
  defineIslandAssociations();
  defineUserAssociations();
  defineLevelAssociations();
  definePrerequisiteIslandAssociations();
  defineReviewAssociations();
  defineUserCourseAssociations();
};

defineAssociations();
