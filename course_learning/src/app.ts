import express, { Request, Response } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { showLevelRouter } from './routes/level/show';
import { showHintRouter } from './routes/show-hints';
import { submitQuizRouter } from './routes/submit-quiz';
import { showRewardsRouter } from './routes/show-rewards';
import { showLeaderboardRouter } from './routes/show-leaderboard';
import { createFeedbackRouter } from './routes/feedback/new';
import { showFeedbackRouter } from './routes/feedback/show';
import { showProgressRouter } from './routes/progress/show';

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
app.use(showRewardsRouter);
app.use(showLeaderboardRouter);
app.use(createFeedbackRouter);
app.use(showFeedbackRouter);
app.use(showProgressRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response) => {
  errorHandler(err, req, res);
});

export { app };
