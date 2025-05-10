import { CompletionStatus } from '@datn242/questify-common';
import { UserIsland } from '../models/user-island';
import { UserCourse } from '../models/user-course';
import { Level } from '../models/level';
import { UserLevel } from '../models/user-level';
import { Island } from '../models/island';
import { PrerequisiteIsland } from '../models/prerequisite-island';

// Helper function to update island points when level points change
export async function updateIslandPoints(userId: string, islandId: string, pointDifference: number): Promise<void> {
  try {
    const userIsland = await UserIsland.findOne({
      where: {
        userId,
        islandId,
      },
    });

    if (!userIsland) {
      console.error(`User island not found for userId ${userId} and islandId ${islandId}`);
      return;
    }

    // Update the island points
    const newPoint = userIsland.point + pointDifference;
    await userIsland.update({ point: newPoint });

    // Get course ID to propagate the change
    const island = await Island.findByPk(islandId);
    if (island) {
      await updateCoursePoints(userId, island.courseId, pointDifference);
    }
  } catch (error) {
    console.error('Error updating island points:', error);
  }
}

// Helper function to update course points when island points change
export async function updateCoursePoints(userId: string, courseId: string, pointDifference: number): Promise<void> {
  try {
    const userCourse = await UserCourse.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (!userCourse) {
      console.error(`User course not found for userId ${userId} and courseId ${courseId}`);
      return;
    }

    // Update the course points
    const newPoint = userCourse.point + pointDifference;
    await userCourse.update({ point: newPoint });
  } catch (error) {
    console.error('Error updating course points:', error);
  }
}

// Helper function to unlock the next level after a level is completed
export async function unlockNextLevel(userId: string, islandId: string, currentPosition: number): Promise<void> {
  try {
    // Find the next level in the island based on position
    const nextLevel = await Level.findOne({
      where: {
        islandId,
        position: currentPosition + 1,  // Next position
      },
    });

    if (!nextLevel) {
      console.log(`No next level found in island ${islandId} after position ${currentPosition}, might be the last level`);
      return;
    }

    // Find the user level for this next level
    const userNextLevel = await UserLevel.findOne({
      where: {
        userId,
        levelId: nextLevel.id,
      },
    });

    if (!userNextLevel) {
      console.error(`User level not found for next level ${nextLevel.id}`);
      return;
    }

    // Only update if it's locked
    if (userNextLevel.completionStatus === CompletionStatus.Locked) {
      await userNextLevel.update({ 
        completionStatus: CompletionStatus.InProgress 
      });
      console.log(`Unlocked next level ${nextLevel.id} (position ${nextLevel.position}) for user ${userId}`);
    } else {
      console.log(`Next level ${nextLevel.id} (position ${nextLevel.position}) is already ${userNextLevel.completionStatus}`);
    }
  } catch (error) {
    console.error('Error unlocking next level:', error);
  }
}

// Helper function to check if all levels in an island are completed and update island status
export async function checkAndUpdateIslandStatus(userId: string, islandId: string): Promise<void> {
  try {
    // Get all levels for this island
    const levels = await Level.findAll({
      where: {
        islandId,
      },
      order: [['position', 'ASC']],
    });

    if (levels.length === 0) {
      console.log(`No levels found for island ${islandId}`);
      return; // No levels to check
    }

    console.log(`Found ${levels.length} levels for island ${islandId}`);

    // Get user level statuses
    const levelIds = levels.map(level => level.id);
    const userLevels = await UserLevel.findAll({
      where: {
        userId,
        levelId: levelIds,
      },
    });

    console.log(`Found ${userLevels.length} user levels for island ${islandId}`);

    // Check if all levels are completed
    const allCompleted = userLevels.length === levels.length && 
      userLevels.every(userLevel => userLevel.completionStatus === CompletionStatus.Completed);

    console.log(`Island ${islandId} all levels completed: ${allCompleted}`);

    if (allCompleted) {
      // Update island status to Completed
      const userIsland = await UserIsland.findOne({
        where: {
          userId,
          islandId,
        },
      });

      if (userIsland && userIsland.completionStatus !== CompletionStatus.Completed) {
        const now = new Date();
        await userIsland.update({ 
          completionStatus: CompletionStatus.Completed,
          finishedDate: now
        });
        console.log(`Island ${islandId} marked as completed for user ${userId}`);

        // Get the island's course
        const island = await Island.findByPk(islandId);
        if (island) {
          // Unlock dependent islands
          await unlockDependentIslands(userId, islandId, island.courseId);
          
          // Check course status
          await checkAndUpdateCourseStatus(userId, island.courseId);
        }
      } else {
        console.log(`Island ${islandId} already marked as completed or not found`);
      }
    } else {
      console.log(`Not all levels in island ${islandId} are completed`);
      
      // Log the uncompleted levels for debugging
      const uncompletedLevels = userLevels.filter(userLevel => 
        userLevel.completionStatus !== CompletionStatus.Completed
      );
      
      if (uncompletedLevels.length > 0) {
        console.log(`Uncompleted levels: ${uncompletedLevels.map(ul => ul.levelId).join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error checking and updating island status:', error);
  }
}

// Helper function to unlock islands that depend on this completed island
export async function unlockDependentIslands(userId: string, completedIslandId: string, courseId: string): Promise<void> {
  try {
    // Find all islands that have this island as a prerequisite
    const prerequisiteRecords = await PrerequisiteIsland.findAll({
      where: {
        prerequisiteIslandId: completedIslandId,
      },
    });

    console.log(`Found ${prerequisiteRecords.length} islands that depend on island ${completedIslandId}`);

    // For each dependent island
    for (const prerequisite of prerequisiteRecords) {
      const dependentIslandId = prerequisite.islandId;
      
      console.log(`Checking prerequisites for dependent island ${dependentIslandId}`);
      
      // Check if all prerequisites for this dependent island are completed
      const allPrerequisitesCompleted = await areAllPrerequisitesCompleted(userId, dependentIslandId);
      
      console.log(`All prerequisites completed for island ${dependentIslandId}: ${allPrerequisitesCompleted}`);
      
      if (allPrerequisitesCompleted) {
        // Update the dependent island to in-progress
        const userIsland = await UserIsland.findOne({
          where: {
            userId,
            islandId: dependentIslandId,
          },
        });
        
        if (userIsland && userIsland.completionStatus === CompletionStatus.Locked) {
          await userIsland.update({ completionStatus: CompletionStatus.InProgress });
          console.log(`Island ${dependentIslandId} set to in-progress for user ${userId}`);
          
          // Also unlock the first level of this island
          await unlockFirstLevel(userId, dependentIslandId);
        } else {
          console.log(`Island ${dependentIslandId} is already ${userIsland?.completionStatus || 'unknown'}`);
        }
      }
    }
  } catch (error) {
    console.error('Error unlocking dependent islands:', error);
  }
}

// Helper function to check if all prerequisites for an island are completed
export async function areAllPrerequisitesCompleted(userId: string, islandId: string): Promise<boolean> {
  try {
    // Get all prerequisite island IDs for this island
    const prerequisites = await PrerequisiteIsland.findAll({
      where: {
        islandId,
      },
    });
    
    if (prerequisites.length === 0) {
      console.log(`Island ${islandId} has no prerequisites`);
      return true; // No prerequisites, so all are "completed"
    }
    
    const prerequisiteIslandIds = prerequisites.map(p => p.prerequisiteIslandId);
    console.log(`Island ${islandId} has prerequisites: ${prerequisiteIslandIds.join(', ')}`);
    
    // Get user island status for all prerequisites
    const userPrerequisiteIslands = await UserIsland.findAll({
      where: {
        userId,
        islandId: prerequisiteIslandIds,
      },
    });
    
    // Check if all prerequisites are completed
    const allCompleted = userPrerequisiteIslands.length === prerequisiteIslandIds.length && 
           userPrerequisiteIslands.every(ui => ui.completionStatus === CompletionStatus.Completed);
    
    console.log(`All prerequisites completed check: ${allCompleted}`);
    
    // Log any missing or incomplete prerequisites for debugging
    if (!allCompleted) {
      const missingIslands = prerequisiteIslandIds.filter(id => 
        !userPrerequisiteIslands.some(ui => ui.islandId === id)
      );
      
      if (missingIslands.length > 0) {
        console.log(`Missing user islands for prerequisites: ${missingIslands.join(', ')}`);
      }
      
      const incompleteIslands = userPrerequisiteIslands
        .filter(ui => ui.completionStatus !== CompletionStatus.Completed)
        .map(ui => ui.islandId);
      
      if (incompleteIslands.length > 0) {
        console.log(`Incomplete prerequisite islands: ${incompleteIslands.join(', ')}`);
      }
    }
    
    return allCompleted;
  } catch (error) {
    console.error('Error checking prerequisites completion:', error);
    return false;
  }
}

// Helper function to unlock the first level of an island
export async function unlockFirstLevel(userId: string, islandId: string): Promise<void> {
  try {
    // Find the first level in the island
    const firstLevel = await Level.findOne({
      where: {
        islandId,
      },
      order: [['position', 'ASC']],
    });
    
    if (!firstLevel) {
      console.error(`No levels found for island ${islandId}`);
      return;
    }
    
    console.log(`First level in island ${islandId} is ${firstLevel.id} at position ${firstLevel.position}`);
    
    // Update user level for the first level
    const userLevel = await UserLevel.findOne({
      where: {
        userId,
        levelId: firstLevel.id,
      },
    });
    
    if (!userLevel) {
      console.error(`User level not found for first level ${firstLevel.id}`);
      return;
    }
    
    if (userLevel.completionStatus === CompletionStatus.Locked) {
      await userLevel.update({ completionStatus: CompletionStatus.InProgress });
      console.log(`First level ${firstLevel.id} of island ${islandId} set to in-progress for user ${userId}`);
    } else {
      console.log(`First level ${firstLevel.id} is already ${userLevel.completionStatus}`);
    }
  } catch (error) {
    console.error('Error unlocking first level:', error);
  }
}

// Helper function to check if all islands in a course are completed
export async function checkAndUpdateCourseStatus(userId: string, courseId: string): Promise<void> {
  try {
    // Get all islands for this course
    const islands = await Island.findAll({
      where: {
        courseId,
      },
    });

    if (islands.length === 0) {
      return; // No islands to check
    }

    console.log(`Found ${islands.length} islands for course ${courseId}`);

    // Get user island statuses
    const islandIds = islands.map(island => island.id);
    const userIslands = await UserIsland.findAll({
      where: {
        userId,
        islandId: islandIds,
      },
    });

    // Check if all islands are completed
    const allCompleted = userIslands.length === islands.length && 
      userIslands.every(userIsland => userIsland.completionStatus === CompletionStatus.Completed);

    console.log(`All islands completed in course ${courseId}: ${allCompleted}`);

    if (allCompleted) {
      // Update course status to Completed
      const userCourse = await UserCourse.findOne({
        where: {
          userId,
          courseId,
        },
      });

      if (userCourse && userCourse.completionStatus !== CompletionStatus.Completed) {
        const now = new Date();
        await userCourse.update({ 
          completionStatus: CompletionStatus.Completed,
          finishedDate: now
        });
        console.log(`Course ${courseId} marked as completed for user ${userId}`);
      } else {
        console.log(`Course ${courseId} already marked as completed or not found`);
      }
    } else {
      console.log(`Not all islands in course ${courseId} are completed`);
      
      // Log the uncompleted islands for debugging
      const uncompletedIslands = userIslands.filter(userIsland => 
        userIsland.completionStatus !== CompletionStatus.Completed
      );
      
      if (uncompletedIslands.length > 0) {
        console.log(`Uncompleted islands: ${uncompletedIslands.map(ui => ui.islandId).join(', ')}`);
      }
    }
  } catch (error) {
    console.error('Error checking and updating course status:', error);
  }
}