import { Testcase } from '../testcase';
import { CodeProblem } from '../codeProblem';

const defineTestcaseAssociations = () => {
  Testcase.belongsTo(CodeProblem, { foreignKey: 'codeProblemId' });
};

export default defineTestcaseAssociations;
