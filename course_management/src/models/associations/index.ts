import defineCourseAssociations from './course.associations';

import defineIslandAssociations from './island.associations';
import defineUserAssociations from './user.associations';
import defineLevelAssociations from './level.associations';
import definePrerequisiteIslandAssociations from './prerequisiteIsland.associations';
import defineReviewAssociations from './review.associations';

export const defineAssociations = () => {
  defineCourseAssociations();
  defineIslandAssociations();
  defineUserAssociations();
  defineLevelAssociations();
  definePrerequisiteIslandAssociations();
  defineReviewAssociations();
};

defineAssociations();
