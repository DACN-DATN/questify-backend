import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const successfulSignups = new Counter('successful_signups');
const failedSignups = new Counter('failed_signups');
const duplicateSignups = new Counter('duplicate_signups');

const successfulCreateCourse = new Counter('successful_create_course');
const failedCreateCourse = new Counter('failed_create_course');

export function randomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

export function getCurrentUser() {
  return http.get('https://www.questify.site/api/users/currentuser');
}

export function getCourses() {
  return http.get('https://www.questify.site/api/course-mgmt');
}

export function signOut() {
  return http.post('https://www.questify.site/api/users/signout', {});
}

export function signUp() {
  const userName = `testuser_${randomString(8)}`;
  const email = `test_${randomString(8)}@example.com`;
  const password = '12345aB@';

  const validationResponse = http.post(
    'https://www.questify.site/api/users/validate-credentials',
    JSON.stringify({
      userName: userName,
      email: email,
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (!check(validationResponse, { 'Validation successful': (r) => r.status === 201 || r.status === 200 })) {
    failedSignups.add(1);
    console.log(`Validation failed for ${email}: ${validationResponse.status} - ${validationResponse.body}`);
    return null;
  }
  const signupResponse = http.post(
    'https://www.questify.site/api/users/complete-signup',
    JSON.stringify({
      password: password,
      confirmedPassword: password,
    }),
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (check(signupResponse, { 'Signup successful': (r) => r.status === 201 || r.status === 200 })) {
    successfulSignups.add(1);

    try {
      const userData = JSON.parse(signupResponse.body);

      if (userData && userData.id) {
        const updateResponse = http.patch(
          `https://www.questify.site/api/users/${userData.id}`,
          JSON.stringify({
            role: "teacher",
          }),
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (check(updateResponse, { 'Role update successful': (r) => r.status === 200 })) {
          return userData;
        } else {
          console.log(`Role update failed: ${updateResponse.status} - ${updateResponse.body}`);
          return userData;
        }
      }
    } catch (e) {
      console.log(`Failed to parse response: ${e.message}`);
      return null;
    }
  } else if (signupResponse.status === 409 || (signupResponse.body && signupResponse.body.includes('already exists'))) {
    duplicateSignups.add(1);
    console.log(`Duplicate user detected: ${email}`);
    return null;
  } else {
    failedSignups.add(1);
    console.log(`Failed signup for ${email}: ${signupResponse.status} - ${signupResponse.body}`);
    return null;
  }
}

export function createCourse() {
  const coursePayload = JSON.stringify({
    name: "Introduction to Backend Development",
    description: "Learn how to build robust backend systems using Node.js, Express, and PostgreSQL.",
    category: "Label",
    price: 49.99,
    backgroundImage: "https://cdn.builder.io/api/v1/image/assets/TEMP/dfb32da73c8310560baa7041ffee9d62e89ca8f3",
    learningObjectives: [
      "Understand REST APIs",
      "Work with databases",
      "Authentication & Authorization"
    ],
    requirements: ["Basic JavaScript knowledge", "Git and terminal usage"],
    targetAudience: [
      "Aspiring backend developers",
      "Frontend developers looking to go fullstack"
    ]
  });

  const courseResponse = http.post(
    `https://www.questify.site/api/course-mgmt`,
    coursePayload,
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (check(courseResponse, { 'Course created successfully': (r) => r.status === 200 || r.status === 201 })) {
    successfulCreateCourse.add(1);
    return courseResponse;
  } else {
    failedCreateCourse.add(1);
    console.log(`Course creation failed: ${courseResponse.status} - ${courseResponse.body}`);
    return null;
  }
}