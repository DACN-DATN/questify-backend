import { Level } from '../level';
import { Testcase } from '../testcase';

const defineTestcaseAssociations = () => {
  Testcase.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineTestcaseAssociations;
