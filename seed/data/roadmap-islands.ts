import apiService from '../services/api-service';
import { CourseCategory, ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

// blocker: need to run signup-teacher.ts and signup-student.ts first

async function seed() {
  try {
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher@example.com',
      password: '12345aB@',
    });

    console.log('Teacher login successfully.');

    const courseResponse = await api.post(ResourcePrefix.CourseManagement, {
      name: 'Introduction to Backend Development',
      description:
        'Learn how to build robust backend systems using Node.js, Express, and PostgreSQL.',
      category: CourseCategory.ITSoftware,
      price: 49.99,
      backgroundImage:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3',
      learningObjectives: [
        'Understand REST APIs',
        'Work with databases',
        'Authentication & Authorization',
      ],
      requirements: ['Basic JavaScript knowledge', 'Git and terminal usage'],
      targetAudience: [
        'Aspiring backend developers',
        'Frontend developers looking to go fullstack',
      ],
    });

    const course = courseResponse.data;
    console.log('Course seeded successfully:', course.id);

    const island1Response = await api.post(
      ResourcePrefix.CourseManagement + `/${course.id}/islands`,
      {
        name: '1',
        description: 'First Island',
      },
    );

    const island1 = island1Response.data;

    const island2Response = await api.post(
      ResourcePrefix.CourseManagement + `/${course.id}/islands`,
      {
        name: '2',
        description: 'Second Island',
      },
    );

    const island2 = island2Response.data;

    await api.post(ResourcePrefix.CourseManagement + `/${course.id}/islands`, {
      name: '3',
      description: 'Third Island',
      prerequisiteIslandIds: [island1.id, island2.id],
    });

    await api.post(ResourcePrefix.CourseManagement + `/${course.id}/islands`, {
      name: '4',
      description: 'Fourth Island',
      prerequisiteIslandIds: [island1.id],
    });

    console.log('Islands seeded successfully.');

    apiService.clearCookies();
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Signed out successfully');

    apiService.clearCookies();
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'student@example.com',
      password: '12345aB@',
    });

    console.log('Student login successfully.');

    await api.post(ResourcePrefix.CourseManagement + `/${course.id}/enrollment`, {});
    console.log(`Enroll successfully in course ${course.id}`);
  } catch (error) {
    console.error('Error seeding data:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

seed();
