import { Course } from '../../course';
import { Island } from '../../island';
import { Level } from '../../level';
import { PrerequisiteIsland } from '../../prerequisiteIsland';
import { Review } from '../../review';
import { UserCourse } from '../../user-course';
import { User } from '../../user';

it('check course associations', async () => {
  expect(Object.keys(Course.associations)).toEqual([
    'teacher',
    'Islands',
    'Reviews',
    'students',
    'UserCourses',
  ]);
});

it('check island associations', async () => {
  expect(Object.keys(Island.associations)).toEqual([
    'Course',
    'Levels',
    'prerequisites',
    'islandsThatArePrerequisites',
  ]);
});

it('check level associations', async () => {
  expect(Object.keys(Level.associations)).toEqual(['Island']);
});

it('check prerequisite island associations', async () => {
  expect(Object.keys(PrerequisiteIsland.associations)).toEqual(['Island']);
});

it('check review associations', async () => {
  expect(Object.keys(Review.associations)).toEqual(['User', 'Course']);
});

it('check user-course associations', async () => {
  expect(Object.keys(UserCourse.associations)).toEqual(['User', 'Course']);
});

it('check user associations', async () => {
  expect(Object.keys(User.associations)).toEqual([
    'teacherCourses',
    'Reviews',
    'enrolledCourses',
    'UserCourses',
  ]);
});
