import { app } from './app';
import { connectDb, closeDbConnection } from './config/db';
import { natsWrapper } from './nats-wrapper';
import { syncModels } from './scripts/sync';
import { UserCourseCreatedListener } from './events/listeners/user-course-created-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { CourseCreatedListener } from './events/listeners/course-created-listener';
import { IslandCreatedListener } from './events/listeners/island-created-listener';
import { IslandUpdatedListener } from './events/listeners/island-updated-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';

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

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    new UserCourseCreatedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new CourseCreatedListener(natsWrapper.client).listen();
    new IslandCreatedListener(natsWrapper.client).listen();
    new IslandUpdatedListener(natsWrapper.client).listen();

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
  } catch (err) {
    console.error(err);
  }
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();
