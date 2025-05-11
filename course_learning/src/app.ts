import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@datn242/questify-common';

import { showLevelRouter } from './routes/level/show';
import { showHintRouter } from './routes/others/show-hints';
import { submitQuizRouter } from './routes/others/submit-quiz';
import { showRewardsRouter } from './routes/others/show-rewards';
import { showLeaderboardRouter } from './routes/others/show-leaderboard';
import { createFeedbackRouter } from './routes/feedback/new';
import { showFeedbackRouter } from './routes/feedback/show';
import { showProgressRouter } from './routes/progress/show';
import { showAllProgressRouter } from './routes/progress/show-all';
import { showUserIslandRouter } from './routes/roadmap/show-user-island';
import { showUserLevelRouter } from './routes/roadmap/show-user-level';
import { initUserIslandRouter } from './routes/roadmap/init-user-island';
import { initUserLevelRouter } from './routes/roadmap/init-user-level';
import { updateProgressRouter } from './routes/progress/update';

import { deleteAllRouter } from './routes/dev-only/delete-all';

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
app.use(showAllProgressRouter);
app.use(showUserIslandRouter);
app.use(showUserLevelRouter);
app.use(initUserIslandRouter);
app.use(initUserLevelRouter);
app.use(updateProgressRouter);

app.use(deleteAllRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export { app };
