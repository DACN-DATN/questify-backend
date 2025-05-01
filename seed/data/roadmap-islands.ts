import apiService from '../services/api-service';
import { UserRole, CourseCategory, ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

async function seed() {
  try {
    let teacherResponse = await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'teacher@example.com',
      userName: 'Teacher',
    });
    console.log('Validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    teacherResponse = await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });
    console.log('Complete signup successful');

    await api.patch(ResourcePrefix.Auth + `/${teacherResponse.data.id}`, {
      role: UserRole.Teacher,
    });

    console.log('Teacher user seeded successfully.');

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
    await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'student@example.com',
      userName: 'Student',
    });
    console.log('Student validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });

    console.log('Student user seeded successfully.');

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
