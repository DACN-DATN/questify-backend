// import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const start = async () => {
  // if (!process.env.JWT_KEY) {
  //   throw new Error('JWT_KEY must be defined');
  // }
  if (!process.env.POSTGRES_URI) {
    throw new Error('POSTGRES_URI must be defined');
  }
  const sequelize = new Sequelize(process.env.POSTGRES_URI);
  try {
    await sequelize.authenticate();
    console.log('Connected to Postgres');
  } catch (err) {
    console.error(err);
  }

  process.on('SIGINT', async () => {
    console.log('Gracefully shutting down...');
    await sequelize.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('Shutting down due to SIGTERM...');
    await sequelize.close();
    process.exit(0);
  });
};

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});

start();
