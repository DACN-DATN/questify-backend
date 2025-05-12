import { BadRequestError, CompletionStatus, NotAuthorizedError } from '@datn242/questify-common';
import { UserLevel } from '../models/user-level';
import { Attempt } from '../models/attempt';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { calculateScore } from './calculate-point';
import { AttemptUpdatedPublisher } from '../events/publishers/attempt-updated-publisher';

function getRandom(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function submitChallenge(userId: string, levelId: string) {
  const progress = await UserLevel.findOne({
    where: {
      userId: userId,
      levelId: levelId,
    },
  });

  if (!progress) {
    throw new NotAuthorizedError();
  }

  let gold = 0;
  let exp = 0;
  const bonusGold = getRandom(10, 100);
  const bonusExp = getRandom(10, 100);

  if (progress.completionStatus !== CompletionStatus.Completed) {
    gold = 200;
    exp = 200;
    progress.set({
      completionStatus: CompletionStatus.Completed,
    });
  }

  const attempt = await Attempt.findOne({
    where: {
      userId: userId,
      levelId: levelId,
    },
    order: [['createdAt', 'DESC']],
  });

  if (!attempt) {
    throw new BadRequestError('Attempt not found');
  }

  const now = new Date();
  const createdAt = new Date(attempt.createdAt).getTime();

  const point = calculateScore(Math.floor((now.getTime() - createdAt) / 1000));
  attempt.set({
    finishedAt: now,
    point: point,
  });

  new AttemptUpdatedPublisher(natsWrapper.client).publish(attempt!);

  const user = await User.findByPk(userId);
  const currentExp = user!.exp || 0;
  user!.set({
    exp: currentExp + exp + bonusExp,
  });

  new UserUpdatedPublisher(natsWrapper.client).publish(user!);

  await progress.save();
  await attempt.save();
  await user!.save();

  return {
    userId: userId,
    levelId: levelId,
    gold: gold,
    exp: exp,
    point: point,
    bonusGold: bonusGold,
    bonusExp: bonusExp,
  };
}
