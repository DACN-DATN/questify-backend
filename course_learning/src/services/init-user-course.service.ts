import { BadRequestError, CompletionStatus } from '@datn242/questify-common';
import { User } from '../models/user';
import { Course } from '../models/course';
import { UserCourse } from '../models/user-course';
import { initializeUserIslands } from './init-user-island.service';
import { Island } from '../models/island';
import { UserIsland } from '../models/user-island';
import { sequelize } from '../config/db';
import { Transaction } from 'sequelize';

/**
 * Initialize a user's enrollment in a course with transaction support
 * @param courseId - The ID of the course to enroll in
 * @param userId - The ID of the user to enroll
 * @returns The created or existing UserCourse record
 */
export async function initializeUserCourse(courseId: string, userId: string): Promise<UserCourse> {
  // Start a transaction to ensure data consistency
  const transaction = await sequelize.transaction();

  try {
    // Validate course exists
    const course = await Course.findByPk(courseId, { transaction });
    if (!course) {
      await transaction.rollback();
      throw new BadRequestError('Course not found');
    }

    // Validate user exists
    const student = await User.findByPk(userId, { transaction });
    if (!student) {
      await transaction.rollback();
      throw new BadRequestError('User not found');
    }

    // Check if user is already enrolled
    const existingEnrollment = await UserCourse.findOne({
      where: {
        userId: userId,
        courseId: courseId,
      },
      transaction,
    });

    // If already enrolled, just return the existing enrollment
    if (existingEnrollment) {
      await transaction.commit();
      return existingEnrollment;
    }

    // Create the user-course record
    const userCourse = await UserCourse.create(
      {
        userId: userId,
        courseId: courseId,
        point: 0,
        completionStatus: CompletionStatus.InProgress,
      },
      { transaction },
    );

    // Initialize islands within the same transaction
    await initializeUserIslandsWithTransaction(courseId, userId, transaction);

    // Commit the transaction
    await transaction.commit();
    return userCourse;
  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();
    console.error(`Error initializing user course: ${error}`);
    throw error;
  }
}

/**
 * Initialize user islands with transaction support
 * This is a private function to be used within initializeUserCourse
 */
async function initializeUserIslandsWithTransaction(
  courseId: string,
  userId: string,
  transaction: Transaction,
): Promise<UserIsland[]> {
  // Find all islands for this course
  const islands = await Island.findAll({
    where: {
      courseId: courseId,
    },
    transaction,
  });

  if (!islands || islands.length === 0) {
    throw new BadRequestError('Islands not found');
  }

  // First check if user islands already exist
  const existingUserIslands = await UserIsland.findAll({
    where: {
      userId: userId,
      islandId: islands.map((island) => island.id),
    },
    transaction,
  });

  // If user islands already exist, return them
  if (existingUserIslands.length === islands.length) {
    return existingUserIslands;
  }

  // Create new user islands only for islands that don't already have user islands
  const existingIslandIds = new Set(existingUserIslands.map((ui) => ui.islandId));
  const userIslandsToCreate = islands.filter((island) => !existingIslandIds.has(island.id));

  const userIslands: UserIsland[] = [];

  // Create user islands for any that don't already exist
  for (const island of userIslandsToCreate) {
    const status = island.position === 0 ? CompletionStatus.InProgress : CompletionStatus.Locked;

    const userIsland = await UserIsland.create(
      {
        userId: userId,
        islandId: island.id,
        point: 0,
        completionStatus: status,
      },
      { transaction },
    );

    userIslands.push(userIsland);
  }

  // Return all user islands (new and existing)
  return [...existingUserIslands, ...userIslands];
}

/**
 * Get a user's enrollment in a course
 * @param courseId - The ID of the course
 * @param userId - The ID of the user
 * @returns The UserCourse record if found, null otherwise
 */
export async function getUserCourseEnrollment(
  courseId: string,
  userId: string,
): Promise<UserCourse | null> {
  return await UserCourse.findOne({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });
}

/**
 * Check if a user is enrolled in a course
 * @param courseId - The ID of the course
 * @param userId - The ID of the user
 * @returns True if enrolled, false otherwise
 */
export async function isUserEnrolledInCourse(courseId: string, userId: string): Promise<boolean> {
  const enrollment = await getUserCourseEnrollment(courseId, userId);
  return !!enrollment;
}
