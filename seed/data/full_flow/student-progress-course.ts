import apiService from '../../services/api-service';
import { CompletionStatus, ResourcePrefix } from '@datn242/questify-common';
import fs from 'fs';
import path from 'path';

const api = apiService.instance;

/**
 * Update student progress
 * - Reads course and student IDs from seed-data.json
 * - Updates level completion status to simulate course activity
 * - Island 1: All levels completed
 * - Island 2: 3 levels completed, 1 in progress, 1 locked
 * - Island 3: 1 level in progress (already set by default), others locked
 * - Island 4: All levels locked (already set by default)
 */
async function seedStudentProgress() {
  try {
    // Load course data
    const courseData = loadCourseData();
    if (!courseData || !courseData.courseId || !courseData.studentId || !courseData.islandIds) {
      console.error('Incomplete course data. Please run previous seed scripts first.');
      process.exit(1);
    }
    
    const { courseId, studentId, islandIds } = courseData;
    
    // Login as student
    console.log('Logging in as student...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'student@example.com',
      password: '12345aB@',
    });
    console.log('Student login successful.');
    
    // Get user level data for each island
    const userLevelsByIsland = await getUserLevelsByIsland(islandIds);
    
    // Island 1: All levels completed
    console.log('\nUpdating Island 1 levels (All completed)...');
    for (let i = 0; i < userLevelsByIsland[0].length; i++) {
      const points = 100 - (i * 5); // Decreasing points for each level
      const finishedDate = new Date();
      // Stagger completion dates to make it more realistic
      finishedDate.setDate(finishedDate.getDate() - (userLevelsByIsland[0].length - i));
      
      await updateLevelStatus(
        studentId,
        userLevelsByIsland[0][i].levelId,
        CompletionStatus.Completed,
        points,
        finishedDate.toISOString()
      );
    }
    
    // Island 2: 3 levels completed, 1 in progress, 1 locked
    console.log('\nUpdating Island 2 levels (3 completed, 1 in progress, 1 locked)...');
    const island2Levels = userLevelsByIsland[1];
    
    // First 3 levels completed
    for (let i = 0; i < 3; i++) {
      const points = 95 - (i * 5); // Decreasing points
      const finishedDate = new Date();
      finishedDate.setDate(finishedDate.getDate() - (3 - i));
      
      await updateLevelStatus(
        studentId,
        island2Levels[i].levelId,
        CompletionStatus.Completed,
        points,
        finishedDate.toISOString()
      );
    }
    
    // 4th level in progress
    await updateLevelStatus(
      studentId,
      island2Levels[3].levelId,
      CompletionStatus.InProgress,
      0
    );
    
    // 5th level stays locked (default)
    console.log('Level 5 remains locked (default status)');
    
    // Island 3: First level is already in progress by default
    console.log('\nIsland 3: First level is in progress by default, others remain locked');
    
    // Island 4: All levels locked (default)
    console.log('\nIsland 4: All levels remain locked (default status)');
    
    console.log('\nStudent progress updated successfully!');
    
    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Student signed out successfully.');
    
  } catch (error) {
    console.error('Error updating student progress:', error.response?.data || error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
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

// Helper function to get user levels by island
async function getUserLevelsByIsland(islandIds: string[]) {
  const userLevelsByIsland = [];
  
  for (const islandId of islandIds) {
    try {
      const response = await api.get(
        ResourcePrefix.CourseLearning + `/roadmap/islands/${islandId}`
      );
      userLevelsByIsland.push(response.data.userLevels);
      console.log(`Fetched ${response.data.userLevels.length} levels for island ${islandId}`);
    } catch (error) {
      console.error(`Error fetching levels for island ${islandId}:`, error.response?.data || error.message);
      userLevelsByIsland.push([]);
    }
  }
  
  return userLevelsByIsland;
}

// Helper function to update a single level's status
async function updateLevelStatus(
  studentId: string,
  levelId: string,
  status: CompletionStatus,
  points: number,
  finishedDate?: string
) {
  try {
    const updateData: any = {
      point: points,
      completion_status: status
    };
    
    // Add finished date if provided
    if (finishedDate) {
      updateData.finished_date = finishedDate;
    }
    
    await api.patch(
      ResourcePrefix.CourseLearning + `/progress/students/${studentId}/levels/${levelId}`,
      updateData
    );
    
    console.log(`Updated level ${levelId} to ${status} with ${points} points${finishedDate ? ' and completion date' : ''}`);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 300));
    
  } catch (error) {
    console.error(`Error updating level ${levelId}:`, error.response?.data || error.message);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  seedStudentProgress();
}

export default seedStudentProgress;