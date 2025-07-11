import {
  BadRequestError,
  CompletionStatus,
  EffectType,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { UserLevel } from '../models/user-level';
import { Attempt } from '../models/attempt';
import { User } from '../models/user';
import { Inventory } from '../models/inventory';
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
  // Load the user's current progress for this level
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

  if (!user_course) {
    throw new BadRequestError('User course not found');
  }

  let goldMultiplier = 1;
  let expMultiplier = 1;

  const effect = user_course.nextLevelEffect;

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

  if (effect) {
    await user_course.update({ nextLevelEffect: null });
  }

  let baseGold = 0;
  let baseExp = 0;
  const randomBonus = getRandom(10, 100);
  const bonusGold = randomBonus * goldMultiplier;
  const bonusExp = randomBonus * expMultiplier;

  // Check if this is a new completion
  const isNewCompletion = progress.completionStatus !== CompletionStatus.Completed;

  if (isNewCompletion) {
    baseGold = 200;
    baseExp = 200;
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

  await attempt.save();

  // Update points if higher
  let pointDifference = 0;
  if (point > progress.point) {
    pointDifference = point - progress.point;
    progress.point = point;
  }

  // Update completion status and finished date
  if (isNewCompletion) {
    progress.completionStatus = CompletionStatus.Completed;
    if (!progress.finishedDate) {
      progress.finishedDate = attempt.finishedAt;
    }
  }

  // Save changes to progress BEFORE checking island status
  await progress.save();

  // Now that the level is saved as completed in the database, update island points
  if (pointDifference > 0) {
    await updateIslandPoints(userId, level.islandId, pointDifference);
  }

  // If this is a new completion, unlock next level and check island status
  if (isNewCompletion) {
    await unlockNextLevel(userId, level.islandId, level.position);
    await checkAndUpdateIslandStatus(userId, level.islandId);
  }

  const user = await User.findByPk(userId);
  const currentExp = user!.exp || 0;
  user!.set({
    exp: currentExp + baseExp + bonusExp,
  });

  console.log('User exp:', user!.exp);

  if (baseGold > 0 || bonusGold > 0) {
    const totalGold = baseGold + bonusGold;
    const inventory = await Inventory.findOne({
      where: {
        user_id: userId,
        course_id: level.Island!.courseId,
        isDeleted: false,
      },
    });

    if (inventory) {
      await inventory.increment('gold', { by: totalGold });
    }
  }

  // Save user changes
  await user!.save();

  // Publish events
  new AttemptUpdatedPublisher(natsWrapper.client).publish(attempt!);
  new UserUpdatedPublisher(natsWrapper.client).publish(user!);

  return {
    userId: userId,
    levelId: levelId,
    gold: baseGold,
    exp: baseExp,
    point: point,
    bonusGold: bonusGold,
    bonusExp: bonusExp,
    totalGold: baseGold + bonusGold,
    totalExp: baseExp + bonusExp,
    appliedEffect: effect || undefined,
  };
}
