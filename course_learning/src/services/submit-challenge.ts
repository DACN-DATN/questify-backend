import {
  BadRequestError,
  CompletionStatus,
  EffectType,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { UserLevel } from '../models/user-level';
import { Attempt } from '../models/attempt';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { calculateScore } from './calculate-point';
import { AttemptUpdatedPublisher } from '../events/publishers/attempt-updated-publisher';
import { Level } from '../models/level';
import { Island } from '../models/island';
import { UserCourse } from '../models/user-course';
import { checkAndUpdateIslandStatus, unlockNextLevel, updateIslandPoints } from './progress-helper';

function getRandom(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function submitLevel(userId: string, levelId: string) {
  const progress = await UserLevel.findOne({
    where: {
      userId: userId,
      levelId: levelId,
    },
  });

  if (!progress) {
    throw new NotAuthorizedError();
  }

  const level = await Level.findOne({
    where: {
      id: levelId,
    },
    include: [
      {
        model: Island,
        as: 'Island',
      },
    ],
  });

  if (!level) {
    throw new BadRequestError('Level not found');
  }

  const user_course = await UserCourse.findOne({
    where: {
      userId: userId,
      courseId: level?.Island?.courseId,
    },
  });

  let goldMultiplier = 1;
  let expMultiplier = 1;

  const effect = user_course?.nextLevelEffect;

  switch (effect) {
    case EffectType.ExpX2:
      expMultiplier = 2;
      break;
    case EffectType.ExpX3:
      expMultiplier = 3;
      break;
    case EffectType.ExpX4:
      expMultiplier = 4;
      break;
    case EffectType.GoldX2:
      goldMultiplier = 2;
      break;
    case EffectType.GoldX3:
      goldMultiplier = 3;
      break;
    case EffectType.GoldX4:
      goldMultiplier = 4;
      break;
  }

  let gold = 0;
  let exp = 0;
  const bonusGold = getRandom(10, 100) * goldMultiplier;
  const bonusExp = getRandom(10, 100) * expMultiplier;

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

  if (point > progress.point) {
    const pointDifference = point - progress.point;
    progress.set({
      point: point,
    });
    await updateIslandPoints(userId, level.islandId, pointDifference);
  }

  if (progress.completionStatus === CompletionStatus.Completed) {
    progress.set({
      completionStatus: CompletionStatus.Completed,
    });
    await unlockNextLevel(userId, level.islandId, level.position);
    await checkAndUpdateIslandStatus(userId, level.islandId);
  }

  const user = await User.findByPk(userId);
  const currentExp = user!.exp || 0;
  user!.set({
    exp: currentExp + exp + bonusExp,
  });

  await progress.save();
  await attempt.save();
  await user!.save();

  new AttemptUpdatedPublisher(natsWrapper.client).publish(attempt!);
  new UserUpdatedPublisher(natsWrapper.client).publish(user!);

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
