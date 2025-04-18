import { UserRole, EnvStage, UserStatus } from '@datn242/questify-common';
process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;
import '../models/associations';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { sequelize } from '../config/db';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

/* eslint-disable no-var */
declare global {
  var getAuthCookie: (gmail?: string) => Promise<string[]>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfdsa';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }

  await sequelize.drop();
  await sequelize.sync();
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();

  await sequelize.close();
});

global.getAuthCookie = async () => {
  // Create a user in the database with this ID
  const user = await User.create({
    role: UserRole.Teacher,
    status: UserStatus.Active,
  });
  const payload = {
    id: user.id,
    role: user.role,
    status: user.status,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};
