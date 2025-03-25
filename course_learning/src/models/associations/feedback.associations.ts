import { User } from '../user';
import { Feedback } from '../feedback';
import { Progress } from '../progress';

const defineFeedbackAssociations = () => {
  Feedback.belongsTo(User, { foreignKey: 'userId' });
  Feedback.belongsTo(Progress, { foreignKey: 'progressId' });
};

export default defineFeedbackAssociations;
