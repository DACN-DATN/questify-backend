import { app } from './app';
import { connectDb, closeDbConnection } from './config/db';
import { natsWrapper } from './nats-wrapper';
import { syncModels } from './scripts/sync';
import { UserCourseCreatedListener } from './events/listeners/user-course-created-listener';
import { LevelCreatedListener } from './events/listeners/level-created-listener';
import { LevelUpdatedListener } from './events/listeners/level-updated-listener';
import { UserCreatedListener } from './events/listeners/user-created-listener';
import { CourseCreatedListener } from './events/listeners/course-created-listener';
import { IslandCreatedListener } from './events/listeners/island-created-listener';
import { IslandUpdatedListener } from './events/listeners/island-updated-listener';
import { UserUpdatedListener } from './events/listeners/user-updated-listener';
import { CourseItemTemplateCreatedListener } from './events/listeners/course-item-template-created-listener';
import { CourseItemTemplateUpdatedListener } from './events/listeners/course-item-templated-updated-listener';
import { ItemTemplateCreatedListener } from './events/listeners/item-template-created-listener';
import { ItemTemplateUpdatedListener } from './events/listeners/item-template-updated-listener';


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
    new LevelCreatedListener(natsWrapper.client).listen();
    new LevelUpdatedListener(natsWrapper.client).listen();
    new UserCreatedListener(natsWrapper.client).listen();
    new UserUpdatedListener(natsWrapper.client).listen();
    new CourseCreatedListener(natsWrapper.client).listen();
    new IslandCreatedListener(natsWrapper.client).listen();
    new IslandUpdatedListener(natsWrapper.client).listen();
    new CourseItemTemplateCreatedListener(natsWrapper.client).listen();
    new CourseItemTemplateUpdatedListener(natsWrapper.client).listen();
    new ItemTemplateCreatedListener(natsWrapper.client).listen();
    new ItemTemplateUpdatedListener(natsWrapper.client).listen();

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
