import { sleep } from 'k6';
import { getCourses, getCurrentUser, createCourse, signOut, signUp } from './api-function.js';

export const options = {
  vus: 500,
  duration: '10m'
};

export default function () {
  const signUpResult = signUp();

  if (signUpResult) {
    const user = getCurrentUser();
    if (user) {
      sleep(5);
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
  sleep(2);
}