import { sequelize } from '../config/db';
import { EnvStage } from '@datn242/questify-common';

const syncModels = async () => {
  if (process.env.NODE_ENV === EnvStage.Dev) {
    console.log('⚙️ Running sync in development mode...');
    try {
      await sequelize.sync({ force: true });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  } else if (process.env.NODE_ENV === EnvStage.Prod) {
    console.log('🚀 Production mode detected. Use migrations instead.');
    // TODO: implement migrations for production later. Temporary use force for prod
    try {
      await sequelize.sync({ force: true });
      console.log('Database synced successfully');
    } catch (error) {
      console.error('Error syncing database:', error);
    }
  }
};

export { syncModels };
