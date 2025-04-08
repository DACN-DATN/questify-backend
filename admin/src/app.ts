import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { indexUserRouter } from './routes/users/index';
import { showUserRouter } from './routes/users/show';
import { updateUserRouter } from './routes/users/update';
import { newIslandTemplateRouter } from './routes/island_templates/new';
import { indexIslandTemplateRouter } from './routes/island_templates/index';
import { deleteIslandTemplateRouter } from './routes/island_templates/delete';

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

app.use(indexUserRouter);
app.use(showUserRouter);
app.use(updateUserRouter);
app.use(indexIslandTemplateRouter);
app.use(newIslandTemplateRouter);
app.use(deleteIslandTemplateRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response) => {
  errorHandler(err, req, res);
});

export { app };
