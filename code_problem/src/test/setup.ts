import { UserRole, EnvStage, UserStatus, LevelContent } from '@datn242/questify-common';
process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { sequelize } from '../config/db';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Level } from '../models/level';

/* eslint-disable no-var */
declare global {
  var getAuthCookie: (id: string, gmail?: string, userName?: string) => Promise<string[]>;
  var createLevel: (teacherId: string, name?: string, description?: string, position?: number) => Promise<Level>;
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

global.getAuthCookie = async (id: string, gmail: string = 'test@test.com', userName: string = 'username') => {
  // Create a user in the database with this ID
  const user = await User.create({
    id: id,
    gmail: gmail,
    role: UserRole.Teacher,
    userName: userName,
    status: UserStatus.Active
  });
  const payload = {
    id: user.id,
    gmail: user.gmail,
    role: user.role,
  };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: token };
  const sessionJSON = JSON.stringify(session);
  const base64 = Buffer.from(sessionJSON).toString('base64');
  return [`session=${base64}`];
};

global.createLevel = async (teacherId: string, name: string = 'test level', description: string = 'test description', position: number = 1) => {
  const level = await Level.create({
    name: name,
    teacherId: teacherId,
    description: description,
    position: position,
    content_type: LevelContent.CodeProblem,
  });

  return level;
};
