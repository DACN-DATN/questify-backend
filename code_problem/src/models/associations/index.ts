import defineLevelAssociations from './level.associations';
import defineProgressAssociations from './progress.associations';
import defineTestcaseAssociations from './testcase.associations';
import defineUserAssociations from './user.associations';

export const defineAssociations = () => {
  defineLevelAssociations();
  defineProgressAssociations();
  defineTestcaseAssociations();
  defineUserAssociations();
};

defineAssociations();
