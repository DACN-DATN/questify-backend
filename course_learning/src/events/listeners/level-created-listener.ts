import { Message } from 'node-nats-streaming';
import { Subjects, Listener, LevelCreatedEvent, CompletionStatus } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Level } from '../../models/level';
import { Island } from '../../models/island';
import { retryService } from '../../services/retry-service';
import { UserCourse } from '../../models/user-course';
import { UserLevel } from '../../models/user-level';
import { UserIsland } from '../../models/user-island';

export class LevelCreatedListener extends Listener<LevelCreatedEvent> {
  subject: Subjects.LevelCreated = Subjects.LevelCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: LevelCreatedEvent['data'], msg: Message) {
    try {
      const { id, islandId, name, description, position, contentType } = data;

      // Check if level already exists
      const existingLevel = await Level.findByPk(id);
      if (existingLevel) {
        console.log(`Level already exists with ID: ${id}`);
        msg.ack();
        return;
      }

      // Check if island exists
      const existingIsland = await Island.findByPk(islandId);
      if (!existingIsland) {
        console.log(`Island not found with ID: ${islandId}, queuing for retry`);
        // Add to retry queue instead of immediately acking
        await retryService.addEvent(this.subject, data);
        msg.ack();
        return;
      }

      const level = Level.build({
        id,
        name,
        description,
        position,
        islandId,
        contentType,
      });

      await level.save();

      const user_course = await UserCourse.findAll({
        where: {
          courseId: existingIsland.courseId,
        },
        attributes: ['userId'],
      });

      const userIds = user_course.map((uc) => uc.userId);

      await Promise.all(
        userIds.map(async (userId) => {
          // Get the user's island status
          const userIsland = await UserIsland.findOne({
            where: {
              userId,
              islandId,
            },
          });

          let completionStatus = CompletionStatus.Locked;

          // Special case: If it's the first level (position 0) in an in-progress island
          if (position === 0 && userIsland?.completionStatus === CompletionStatus.InProgress) {
            completionStatus = CompletionStatus.InProgress;
          } else if (position > 0) {
            // Check if the previous level is completed
            const previousLevel = await Level.findOne({
              where: {
                islandId,
                position: position - 1,
              },
            });

            if (previousLevel) {
              const previousUserLevel = await UserLevel.findOne({
                where: {
                  userId,
                  levelId: previousLevel.id,
                },
              });

              // Only set to InProgress if previous level is completed
              if (previousUserLevel?.completionStatus === CompletionStatus.Completed) {
                completionStatus = CompletionStatus.InProgress;
              }
            }
          }

          // Create the UserLevel with the determined status
          return UserLevel.create({
            userId,
            levelId: level.id,
            completionStatus,
            point: 0,
          });
        }),
      );

      msg.ack();
    } catch (error) {
      console.error('Error processing level:created event:', error);
      await retryService.addEvent(this.subject, data);
      msg.ack();
      return;
    }
  }
}
