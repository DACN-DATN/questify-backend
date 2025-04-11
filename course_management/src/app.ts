import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { indexCourseRouter } from './routes/course/index';
import { showCourseRouter } from './routes/course/show';
import { createCourseRouter } from './routes/course/new';
import { updateCourseRouter } from './routes/course/update';
import { deleteCourseRouter } from './routes/course/delete';

import { createIslandRouter } from './routes/island/new';
import { showIslandRouter } from './routes/island/show';
import { updateIslandRouter } from './routes/island/update';

import { createLevelRouter } from './routes/level/new';
import { indexIslandRouter } from './routes/island';
import { indexLevelRouter } from './routes/level';
import { updateLevelRouter } from './routes/level/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false, // disable encryption
    secure: false, // disable https
  }),
);
app.use(currentUser);

app.use(indexCourseRouter);
app.use(showCourseRouter);
app.use(createCourseRouter);
app.use(updateCourseRouter);
app.use(deleteCourseRouter);

app.use(createIslandRouter);
app.use(showIslandRouter);
app.use(updateIslandRouter);
app.use(indexIslandRouter);

app.use(createLevelRouter);
app.use(indexLevelRouter);
app.use(updateLevelRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
