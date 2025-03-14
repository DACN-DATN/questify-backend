import { Sequelize } from 'sequelize';

if (!process.env.POSTGRES_URI) {
  throw new Error('POSTGRES_URI must be defined');
}

const sequelize = new Sequelize(process.env.POSTGRES_URI);

const connectDb = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

const closeDbConnection = async () => {
  await sequelize.close();
};

export { sequelize, connectDb, closeDbConnection };
