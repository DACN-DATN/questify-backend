import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { showLevelRouter } from './routes/island/show';
import { showHintRouter } from './routes/show_hints';
import { submitQuizRouter } from './routes/submit_quiz';

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

app.use(showLevelRouter);
app.use(showHintRouter);
app.use(submitQuizRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response) => {
  errorHandler(err, req, res);
});

export { app };
