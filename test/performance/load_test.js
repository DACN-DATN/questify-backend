import { sleep } from 'k6';
import { getCourses, getCurrentUser, createCourse, signOut, signUp } from './api-function.js';

export const options = {
  vus: 500,
  duration: '10m',
};

export default function () {
  const signUpResult = signUp();

  if (signUpResult) {
    getCurrentUser();
    getCourses();
  } else {
    console.log("Sign-up failed",);
  }
  signOut();
  sleep(1);
}