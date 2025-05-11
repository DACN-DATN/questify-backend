import { CompletionStatus, NotAuthorizedError } from '@datn242/questify-common';
import { UserLevel } from '../models/user-level';
import { Attempt } from '../models/attempt';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';

function getRandom(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function submitChallenge(levelId: string, userId: string) {
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

  if (progress.gold < gold + bonusGold) {
    progress.set({
      gold: gold + bonusGold,
    });
  }

  if (progress.exp < exp + bonusExp) {
    progress.set({
      exp: exp + bonusExp,
    });
  }

  const attempt = Attempt.build({
    userId: userId,
    gold: gold + bonusGold,
    exp: exp + bonusExp,
    levelId: levelId,
  });

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
    bonusGold: bonusGold,
    bonusExp: bonusExp,
  };
}
