import { Island } from '../models/island';
import { Level } from '../models/level';
import { Course } from '../models/course';
import { PrerequisiteIsland } from '../models/prerequisite-island';
import { User } from '../models/user';
import { retryService } from './retry-service';
import { Subjects, CourseStatus } from '@datn242/questify-common';

// Assuming EventData is the type expected by ProcessorFunction
// If you have access to the type definition, import it instead
type EventData = Record<string, any>;

// Define interfaces for type checking
interface CourseCreatedEvent {
  id: string;
  teacherId: string;
  status: CourseStatus;
  name: string;
  description?: string;
  backgroundImage?: string;
}

interface IslandCreatedEvent {
  id: string;
  courseId: string;
  name: string;
  description?: string;
  position: number;
  backgroundImage?: string;
}

interface LevelCreatedEvent {
  id: string;
  islandId: string;
  name: string;
  description?: string;
  position: number;
}

interface PrerequisiteIslandCreatedEvent {
  islandId: string;
  prerequisiteIslandId: string;
}

// Initialize all event processors
export const initializeEventProcessors = () => {
  // Process Course Created event
  retryService.registerProcessor(Subjects.CourseCreated, async (data: EventData) => {
    try {
      // Type assertion to help TypeScript know what fields are available
      const { id, teacherId, status, name, description, backgroundImage } =
        data as CourseCreatedEvent;

      // Check if course already exists
      const existingCourse = await Course.findByPk(id);
      if (existingCourse) {
        console.log(`Course already exists with ID: ${id}`);
        return true;
      }

      // Check if teacher exists
      const existingTeacher = await User.findByPk(teacherId);
      if (!existingTeacher) {
        console.log(`Teacher not found with ID: ${teacherId}, deferring course creation`);
        return false;
      }

      // Create course
      const course = Course.build({
        id,
        teacherId,
        status,
        name,
        description,
        backgroundImage,
      });
      await course.save();
      console.log(`Successfully created course ${name} (${id}) on retry`);
      return true;
    } catch (error) {
      console.error('Error processing CourseCreated event:', error);
      return false;
    }
  });

  // Process Island Created event
  retryService.registerProcessor(Subjects.IslandCreated, async (data: EventData) => {
    try {
      // Type assertion for IslandCreatedEvent
      const { id, courseId, name, description, position, backgroundImage } =
        data as IslandCreatedEvent;

      // Check if island already exists
      const existingIsland = await Island.findByPk(id);
      if (existingIsland) {
        console.log(`Island already exists with ID: ${id}`);
        return true;
      }

      // Check if course exists
      const existingCourse = await Course.findByPk(courseId);
      if (!existingCourse) {
        console.log(`Course not found with ID: ${courseId}, deferring island creation`);
        return false;
      }

      // Create island
      const island = Island.build({
        id,
        courseId,
        name,
        description,
        position,
        backgroundImage,
      });
      await island.save();
      console.log(`Successfully created island ${name} (${id}) on retry`);
      return true;
    } catch (error) {
      console.error('Error processing IslandCreated event:', error);
      return false;
    }
  });

  // Process Level Created event
  retryService.registerProcessor(Subjects.LevelCreated, async (data: EventData) => {
    try {
      // Type assertion for LevelCreatedEvent
      const { id, islandId, name, description, position } = data as LevelCreatedEvent;

      // Check if level already exists
      const existingLevel = await Level.findByPk(id);
      if (existingLevel) {
        console.log(`Level already exists with ID: ${id}`);
        return true;
      }

      // Check if island exists
      const existingIsland = await Island.findByPk(islandId);
      if (!existingIsland) {
        console.log(`Island not found with ID: ${islandId}, deferring level creation`);
        return false;
      }

      // Create level
      const level = Level.build({
        id,
        name,
        description,
        position,
        islandId,
      });
      await level.save();
      console.log(`Successfully created level ${name} (${id}) on retry`);
      return true;
    } catch (error) {
      console.error('Error processing LevelCreated event:', error);
      return false;
    }
  });

  // Process Prerequisite Island Created event
  retryService.registerProcessor(Subjects.PrerequisiteIslandCreated, async (data: EventData) => {
    try {
      // Type assertion for PrerequisiteIslandCreatedEvent
      const { islandId, prerequisiteIslandId } = data as PrerequisiteIslandCreatedEvent;

      // Check if both islands exist
      const [island, prerequisiteIsland] = await Promise.all([
        Island.findByPk(islandId),
        Island.findByPk(prerequisiteIslandId),
      ]);

      if (!island || !prerequisiteIsland) {
        console.log(
          `One or both islands don't exist. islandId: ${islandId}, prerequisiteIslandId: ${prerequisiteIslandId}`,
        );
        return false;
      }

      // Check if relationship already exists
      const existingPrerequisite = await PrerequisiteIsland.findOne({
        where: {
          islandId,
          prerequisiteIslandId,
        },
      });

      if (existingPrerequisite) {
        console.log(`Prerequisite relationship already exists`);
        return true;
      }

      // Create relationship
      const prerequisite = PrerequisiteIsland.build({
        islandId,
        prerequisiteIslandId,
      });
      await prerequisite.save();
      console.log(
        `Successfully created prerequisite relationship: ${islandId} -> ${prerequisiteIslandId} on retry`,
      );
      return true;
    } catch (error) {
      console.error('Error processing PrerequisiteIslandCreated event:', error);
      return false;
    }
  });
};
