import { app } from './app';
import { connectDb, closeDbConnection } from './config/db';
import { syncModels } from './scripts/sync';

const start = async () => {
  await connectDb();

  await syncModels();

  process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    await closeDbConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down due to SIGTERM...');
    await closeDbConnection();
    process.exit(0);
  });
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();
