import { EffectType, BadRequestError } from '@datn242/questify-common';
import { Course } from '../models/course';

export function randomGoldItem(): number {
  return Math.floor(Math.random() * 190) + 10;
}

export function randomExpItem(): number {
  return Math.floor(Math.random() * 190) + 10;
}

export async function multipleExpForNextLevel(
  effectType: EffectType,
  courseId: string,
): Promise<void> {
  const validExpEffects = [EffectType.ExpX2, EffectType.ExpX3, EffectType.ExpX4];

  if (!validExpEffects.includes(effectType)) {
    throw new BadRequestError(
      `Invalid gold effect type: ${effectType}. Must be one of: ${validExpEffects.join(', ')}`,
    );
  }

  const course = await Course.findByPk(courseId);
  if (!course) {
    throw new BadRequestError('Course not found');
  }
  await course.update({
    nextLevelEffect: effectType,
  });
  await course.save();
  return;
}

export async function multipleGoldForNextLevel(
  effectType: EffectType,
  courseId: string,
): Promise<void> {
  const validGoldEffects = [EffectType.GoldX2, EffectType.GoldX3, EffectType.GoldX4];

  if (!validGoldEffects.includes(effectType)) {
    throw new BadRequestError(
      `Invalid gold effect type: ${effectType}. Must be one of: ${validGoldEffects.join(', ')}`,
    );
  }

  const course = await Course.findByPk(courseId);
  if (!course) {
    throw new BadRequestError('Course not found');
  }
  await course.update({
    nextLevelEffect: effectType,
  });
  await course.save();
  return;
}
