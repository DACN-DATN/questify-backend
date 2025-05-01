import apiService from '../services/api-service';
import { ResourcePrefix, LevelContent, CourseCategory } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher@example.com',
      password: '12345aB@',
    });
    console.log('Teacher sign in successful');

    const courseResponse = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Course 1',
      description: 'Description for Course 1',
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/8fc28dc360c1fe027a04509249c2d9399cd7e5b2',
      category: CourseCategory.ITSoftware,
      price: 100,
      learningObjectives: ['Objective 1', 'Objective 2'],
      requirements: ['Requirement 1', 'Requirement 2'],
      targetAudience: ['Audience 1', 'Audience 2'],
    });

    const course = courseResponse.data;
    console.log('Course seeded successfully:', course.id);

    const island1Response = await api.post(
      ResourcePrefix.CourseManagement + `/${course.id}/islands`,
      {
        name: 'Island 1',
        description: 'Description for Island 1',
      },
    );
    const island1 = island1Response.data;
    console.log('Island 1 seeded successfully:', island1.id);

    const levelResponse = await api.post(
      ResourcePrefix.CourseManagement + `/islands/${island1.id}/level`,
      {
        name: 'Level 1',
        position: 1,
        description: 'Description for Level 1',
        contentType: LevelContent.CodeProblem,
      },
    );
    const level = levelResponse.data;
    console.log('Level seeded successfully:', level.id);

    const codeProblemResponse = await api.post(ResourcePrefix.CodeProblem, {
      level_id: level.id,
      description: 'Description for Code Problem 1',
    });
    const codeProblem = codeProblemResponse.data;
    console.log('Code Problem seeded successfully:', codeProblem.id);

    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher sign out successful');
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
