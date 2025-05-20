import { Message } from 'node-nats-streaming';
import { Subjects, Listener, IslandCreatedEvent, CompletionStatus } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Island } from '../../models/island';
import { Course } from '../../models/course';
import { retryService } from '../../services/retry-service';
import { UserCourse } from '../../models/user-course';
import { UserIsland } from '../../models/user-island';
import { Level } from '../../models/level';
import { UserLevel } from '../../models/user-level';
import { PrerequisiteIsland } from '../../models/prerequisite-island';

export class IslandCreatedListener extends Listener<IslandCreatedEvent> {
  subject: Subjects.IslandCreated = Subjects.IslandCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: IslandCreatedEvent['data'], msg: Message) {
    try {
      const { id, courseId, name, description, position, backgroundImage } = data;

      // Check if island already exists
      const existingIsland = await Island.findByPk(id);
      if (existingIsland) {
        console.log(`Island already exists with ID: ${id}`);
        msg.ack();
        return;
      }

      // Check if course exists
      const existingCourse = await Course.findByPk(courseId);
      if (!existingCourse) {
        console.log(`Course not found with ID: ${courseId}, queuing for retry`);
        await retryService.addEvent(this.subject, data);
        msg.ack();
        return;
      }

      // Course exists, proceed with island creation
      const island = Island.build({
        id,
        courseId,
        name,
        description,
        position,
        backgroundImage,
      });

      await island.save();
      console.log(`Island created: ${name} (${id})`);

      // Find all students enrolled in this course to create UserIsland records
      const enrolledUsers = await UserCourse.findAll({
        where: {
          courseId: courseId,
        },
        attributes: ['userId'],
      });

      // Create UserIsland records for all enrolled students
      if (enrolledUsers.length > 0) {
        console.log(`Creating UserIsland records for ${enrolledUsers.length} enrolled students`);

        // Check if this island has prerequisites
        const hasPrerequisites = await PrerequisiteIsland.findOne({
          where: {
            islandId: id,
          },
        });

        // Determine default status based on position and prerequisites
        // First island (position 0) with no prerequisites starts as InProgress
        // Islands with prerequisites or non-zero position start as Locked
        const defaultStatus =
          position === 0 && !hasPrerequisites
            ? CompletionStatus.InProgress
            : CompletionStatus.Locked;

        // Create UserIsland records for all enrolled students
        await Promise.all(
          enrolledUsers.map(async (userCourse) => {
            const userId = userCourse.userId;

            // Create UserIsland record
            await UserIsland.create({
              userId: userId,
              islandId: id,
              point: 0,
              completionStatus: defaultStatus,
            });

            // If the island should be in progress (first island),
            // also create UserLevel records for all levels in the island
            if (defaultStatus === CompletionStatus.InProgress) {
              // Get all levels for this island
              const levels = await Level.findAll({
                where: { islandId: id },
                order: [['position', 'ASC']],
              });

              // Create UserLevel records for each level
              if (levels.length > 0) {
                await Promise.all(
                  levels.map(async (level, index) => {
                    // First level of an InProgress island is also InProgress
                    const levelStatus =
                      index === 0 ? CompletionStatus.InProgress : CompletionStatus.Locked;

                    return UserLevel.create({
                      userId: userId,
                      levelId: level.id,
                      point: 0,
                      completionStatus: levelStatus,
                    });
                  }),
                );
              }
            }
          }),
        );
      }

      msg.ack();
    } catch (error) {
      console.error('Error processing island:created event:', error);
      await retryService.addEvent(this.subject, data);
      msg.ack();
      return;
    }
  }
}
