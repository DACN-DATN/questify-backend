import { getCourses, getCurrentUser, createCourse, signOut, signUp } from './api-function.js';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const signUpResult = signUp();

  if (signUpResult) {
    const user = getCurrentUser();
    if (user) {
      sleep(2);
      const course = createCourse();
      if (course) {
        getCourses();
      } else {
        console.log("Course Creation Failed");
      }
    }
  } else {
    console.log("Sign-up failed, skipping course creation");
  }
  signOut();
  sleep(1);
}