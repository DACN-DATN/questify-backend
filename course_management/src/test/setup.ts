import { UserRole, EnvStage } from '@datn242/questify-common';
process.env.POSTGRES_URI = 'sqlite::memory:';
process.env.NODE_ENV = EnvStage.Test;

import { MongoMemoryServer } from 'mongodb-memory-server';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { sequelize } from '../config/db';
declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
// let sequelize: Sequelize;

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfdsa';
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});

  // sequelize = new Sequelize({
  //   dialect: 'sqlite',
  //   storage: ':memory:', // SQLite in-memory database
  //   logging: false, // Disable SQL logging
  // });
  // await sequelize.sync();
});

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
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

global.signin = async () => {
  const userName = 'test';
  const email = 'test@test.com';
  const password = 'password';
  const role = UserRole.Student;

  const response = await request(app)
    .post('/api/users/signup')
    .send({
      userName,
      email,
      password,
      role,
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  if (!cookie) {
    throw new Error('Failed to get cookie from response');
  }

  return cookie;
};
