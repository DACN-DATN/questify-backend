import apiService from '../../services/api-service';
import { ResourcePrefix } from '@datn242/questify-common';

const api = apiService.instance;

const STUDENT_IDS = [
  '3f8e4667-4d74-41fe-ac79-57256efb318e',
  '1a9c5dfa-6d7e-4b8b-8c9d-2a5e6f7b8c9d',
  'bce3a092-5f9a-4d8e-9c7b-3a2d1e0f4c5b',
  'd7e6f5c4-b3a2-1d0e-9f8c-7b6a5d4c3b2a',
  'e8f7d6c5-b4a3-2d1e-0f9c-8b7a6d5c4b3a',
  'f9e8d7c6-b5a4-3d2e-1f0c-9b8a7d6c5b4a',
  'a9b8c7d6-e5f4-3g2h-1i0j-k9l8m7n6o5p4',
  'b9c8d7e6-f5g4-3h2i-1j0k-l9m8n7o6p5q4',
  'c9d8e7f6-g5h4-3i2j-1k0l-m9n8o7p6q5r4',
  'd9e8f7g6-h5i4-3j2k-1l0m-n9o8p7q6r5s4',
];

interface StudentCredentials {
  id: string;
  email: string;
  userName: string;
  password: string;
}

async function signupMultipleStudents(): Promise<StudentCredentials[]> {
  console.log('Starting multiple student signup process...');

  const students: StudentCredentials[] = [];
  const studentCount = 10;
  const password = '12345aB@';

  try {
    for (let i = 1; i <= studentCount; i++) {
      const studentEmail = `user${i}@example.com`;
      const studentName = `User ${i}`;
      const studentId = STUDENT_IDS[i - 1];

      console.log(`\n--- Creating user ${i} of ${studentCount} ---`);

      await api.post(ResourcePrefix.Auth + '/validate-credentials', {
        email: studentEmail,
        userName: studentName,
        id: studentId,
      });
      console.log(`Student ${i} validate credentials successful`);

      const signupResponse = await api.post(ResourcePrefix.Auth + '/complete-signup', {
        password: password,
        confirmedPassword: password,
        id: studentId,
      });
      console.log(`Student ${i} complete signup successful`);

      const confirmedStudentId = signupResponse.data.id || studentId;

      students.push({
        id: confirmedStudentId,
        email: studentEmail,
        userName: studentName,
        password: password,
      });

      // Sign out before creating next student
      await api.post(ResourcePrefix.Auth + '/signout', {});
      console.log(`Student ${i} signout successful`);

      // Small delay between students
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    console.log('\nAll students created successfully!');
    return students;
  } catch (error) {
    console.error('Error during student signup:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  signupMultipleStudents();
}

export default signupMultipleStudents;
