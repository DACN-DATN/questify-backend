import defineCourseAssociations from './course.associations';
import defineFeedbackAssociations from './feedback.associations';
import defineIslandAssociations from './island.associations';
import defineMinigameAssociations from './minigame.associations';
import defineProgressAssociations from './progress.associations';
import defineReviewAssociations from './review.associations';
import defineRewardAssociations from './reward.associations';
import defineSlideAssociations from './slide.associations';
import defineSlideTemplateAssociations from './slide-template.associations';
import defineStudentRewardAssociations from './student-reward.associations';
import defineUserAssociations from './user.associations';
import defineLevelAssociations from './level.associations';
import definePrerequisiteIslandAssociations from './prerequisite-island.associations';
import defineVideoAssociations from './video.associations';

export const defineAssociations = () => {
  defineCourseAssociations();
  defineFeedbackAssociations();
  defineIslandAssociations();
  defineMinigameAssociations();
  defineProgressAssociations();
  defineReviewAssociations();
  defineRewardAssociations();
  defineSlideAssociations();
  defineSlideTemplateAssociations();
  defineStudentRewardAssociations();
  defineUserAssociations();
  defineLevelAssociations();
  definePrerequisiteIslandAssociations();
  defineVideoAssociations();
};

defineAssociations();
