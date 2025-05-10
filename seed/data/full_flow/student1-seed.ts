import apiService from '../../services/api-service';
import { UserRole, ResourcePrefix, CompletionStatus } from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

/**
 * Combined seed file for testing that:
 * 1. Signs up a new student (student1)
 * 2. Enrolls the student in the course
 * 3. Updates progress for islands and levels
 */
async function student1TestSeed() {
  try {
    console.log('=== Starting Student1 Test Seed ===');

    // Step 1: Sign up a new student (student1)
    console.log('\n--- Step 1: Creating new student (student1) ---');

    await api.post(ResourcePrefix.Auth + '/validate-credentials', {
      email: 'student1@example.com',
      userName: 'Student1',
    });
    console.log('Student1 validate credentials successful');

    await new Promise((resolve) => setTimeout(resolve, 500));

    const signupResponse = await api.post(ResourcePrefix.Auth + '/complete-signup', {
      password: '12345aB@',
      confirmedPassword: '12345aB@',
    });
    console.log('Student1 complete signup successful');

    // Get current user ID
    const currentUserResponse = await api.get(ResourcePrefix.Auth + '/currentuser');
    const studentId = currentUserResponse.data.currentUser.id;
    console.log(`Student1 ID: ${studentId}`);

    // Load course data
    const courseData = loadCourseData();
    if (!courseData || !courseData.courseId) {
      console.error('No course data found. Please run teacher-course-seed.ts first.');
      await api.post(ResourcePrefix.Auth + '/signout', {});
      process.exit(1);
    }

    const courseId = courseData.courseId;

    // Step 2: Enroll in course
    console.log(`\n--- Step 2: Enrolling Student1 in course ${courseId} ---`);
    await api.post(ResourcePrefix.CourseManagement + `/${courseId}/enrollment`, {});
    console.log(`Enrollment successful in course ${courseId}`);

    // Save a separate data file for student1
    const student1Data = {
      studentId,
      courseId,
      islandIds: courseData.islandIds,
    };
    saveStudent1Data(student1Data);

    // Step 3: Update progress for islands and levels
    console.log('\n--- Step 3: Updating Student1 progress ---');

    // Get island information
    console.log('\nFetching island information...');
    const islands = await getIslandInfo(courseId);

    if (!islands || islands.length === 0) {
      console.error('Failed to fetch island information');
      await api.post(ResourcePrefix.Auth + '/signout', {});
      process.exit(1);
    }

    // Sort islands by position for proper progression
    islands.sort((a, b) => a.position - b.position);

    // Find first island (typically REST API Basics)
    const firstIsland = islands[0];
    const secondIsland = islands.length > 1 ? islands[1] : null;

    console.log(`Found first island: ${firstIsland.name} (${firstIsland.id})`);
    if (secondIsland) {
      console.log(`Found second island: ${secondIsland.name} (${secondIsland.id})`);
    }

    // Get levels for first island
    const firstIslandLevels = await getUserLevelsForIsland(firstIsland.id);

    // Sort levels by position
    firstIslandLevels.sort((a, b) => {
      // Extract position from level object or use 0 as default
      const posA = a.position || 0;
      const posB = b.position || 0;
      return posA - posB;
    });

    // Complete some levels in the first island
    console.log('\nUpdating first island levels (some completed)...');

    // Calculate how many levels to complete (e.g., half of them)
    const levelsToComplete = Math.ceil(firstIslandLevels.length / 2);

    for (let i = 0; i < levelsToComplete; i++) {
      const points = 100 - i * 5; // Decreasing points for each level
      const finishedDate = new Date();
      finishedDate.setDate(finishedDate.getDate() - (levelsToComplete - i));

      // Format date as 'YYYY-MM-DD'
      const year = finishedDate.getFullYear();
      const month = String(finishedDate.getMonth() + 1).padStart(2, '0');
      const day = String(finishedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;

      await updateLevelStatus(
        studentId,
        firstIslandLevels[i].levelId,
        CompletionStatus.Completed,
        points,
        formattedDate,
      );

      // Add a delay to allow state updates to propagate
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Set the next level to in-progress
    if (firstIslandLevels.length > levelsToComplete) {
      await updateLevelStatus(
        studentId,
        firstIslandLevels[levelsToComplete].levelId,
        CompletionStatus.InProgress,
        0,
      );
    }

    console.log(
      `\nLevel progress update completed. Completed ${levelsToComplete} levels in island ${firstIsland.name}`,
    );

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Student1 signed out successfully.');

    console.log('\n=== Student1 Test Seed Completed Successfully ===');
  } catch (error) {
    console.error('Error during Student1 test seed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }

    // Try to sign out in case of error
    try {
      await api.post(ResourcePrefix.Auth + '/signout', {});
      console.log('Signed out after error');
    } catch (signOutError) {
      console.error('Error signing out:', signOutError.message);
    }

    process.exit(1);
  }
}

// Helper function to load course data from JSON file
function loadCourseData() {
  try {
    const filePath = path.join(__dirname, 'seed-data.json');
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return null;
  } catch (error) {
    console.error('Error loading course data:', error);
    return null;
  }
}

// Helper function to save student1 data to JSON file
function saveStudent1Data(data: any) {
  try {
    const filePath = path.join(__dirname, 'student1-data.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Student1 data saved to ${filePath}`);
  } catch (error) {
    console.error('Error saving student1 data:', error);
  }
}

// Helper function to get island information
async function getIslandInfo(courseId: string) {
  try {
    const response = await api.get(ResourcePrefix.CourseManagement + `/${courseId}/islands`);
    return response.data;
  } catch (error) {
    console.error('Error fetching island information:', error.response?.data || error.message);
    return [];
  }
}

// Helper function to get user levels for an island
async function getUserLevelsForIsland(islandId: string) {
  try {
    const response = await api.get(ResourcePrefix.CourseLearning + `/roadmap/islands/${islandId}`);
    console.log(`Fetched ${response.data.userLevels.length} levels for island ${islandId}`);
    return response.data.userLevels;
  } catch (error) {
    console.error(
      `Error fetching levels for island ${islandId}:`,
      error.response?.data || error.message,
    );
    return [];
  }
}

// Helper function to update a single level's status
async function updateLevelStatus(
  studentId: string,
  levelId: string,
  status: CompletionStatus,
  points: number,
  finishedDate?: string,
) {
  try {
    const updateData: any = {
      point: points,
      completion_status: status,
    };

    if (finishedDate) {
      updateData.finished_date = finishedDate;
    }

    await api.patch(
      ResourcePrefix.CourseLearning + `/progress/students/${studentId}/levels/${levelId}`,
      updateData,
    );

    console.log(
      `Updated level ${levelId} to ${status} with ${points} points${finishedDate ? ' and completion date' : ''}`,
    );
  } catch (error) {
    console.error(`Error updating level ${levelId}:`, error.response?.data || error.message);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  student1TestSeed();
}

export default student1TestSeed;
