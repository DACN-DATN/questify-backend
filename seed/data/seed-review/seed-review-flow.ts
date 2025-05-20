import apiService from '../../services/api-service';
import {
  CourseCategory,
  ResourcePrefix,
  IslandPathType,
  CourseStatus,
} from '@datn242/questify-common';
import signupMultipleStudents from './sign-up-students';

const api = apiService.instance;

// Predefined UUIDs for course and island
const REVIEW_COURSE_ID = 'b7c6a5d4-e3f2-1g0h-9i8j-k7l6m5n4o3p2';
const REVIEW_ISLAND_ID = 'c8d7e6f5-g4h3-2i1j-0k9l-m8n7o6p5q4r3';
const REVIEW_LEVEL_ID = 'd9e8f7g6-h5i4-3j2k-1l0m-n9o8p7q6r5s4';

// Student credentials interface
interface StudentCredentials {
  id: string;
  email: string;
  userName: string;
  password: string;
}

// Sample review comments and ratings
const reviewComments = [
  "Great course! I learned a lot and the content was well-organized.",
  "The instructor explains concepts clearly. Would recommend to others.",
  "Very informative course with practical examples.",
  "Excellent content, but some sections could be more detailed.",
  "Good course overall, helped me understand the basics.",
  "The assignments were challenging but helped reinforce the concepts.",
  "I appreciated the real-world applications of the material.",
  "The course was thorough and well-paced.",
  "The instructor's teaching style made complex topics easy to understand.",
  "High-quality content with useful resources.",
  "Some parts were too basic for me, but overall a good introduction.",
  "Enjoyed the practical exercises and projects.",
  "The course exceeded my expectations!",
  "Very comprehensive and well-structured content.",
  "Would have appreciated more advanced topics."
];

// Ratings from 1-5 with 0.5 increments
const ratings = [3, 3.5, 4, 4, 4.5, 4.5, 5, 5, 5, 5];

/**
 * Main flow function to seed course and reviews
 * 1. Create a course with an island and level as a teacher
 * 2. Have multiple students enroll in the course
 * 3. Have each student write a review
 */
async function seedReviewFlow() {
  try {
    console.log('=== STARTING REVIEW SEEDING PROCESS ===');
    
    // Step 1: Sign up 10 students
    console.log('\n[1/3] Creating 10 student accounts...');
    const students = await signupMultipleStudents();
    
    // Step 2: Create a course with an island and level as a teacher
    console.log('\n[2/3] Creating course with one island and level...');
    const courseId = await createReviewCourse();
    
    // Step 3: Have each student enroll and write a review
    console.log('\n[3/3] Students enrolling and writing reviews...');
    await enrollAndReview(courseId, students);
    
    console.log('\n=== REVIEW SEEDING COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Error during review seeding process:', error);
    process.exit(1);
  }
}

/**
 * Create a course with one island and one level
 */
async function createReviewCourse(): Promise<string> {
  try {
    // Login as teacher
    console.log('Logging in as teacher...');
    await api.post(ResourcePrefix.Auth + '/signin', {
      email: 'teacher@example.com',
      password: '12345aB@',
    });
    console.log('Teacher login successful.');

    // Create a course with predefined UUID
    console.log('\nCreating course for reviews...');
    const courseResponse = await api.post(ResourcePrefix.CourseManagement, {
      id: REVIEW_COURSE_ID, // Predefined UUID for the course
      name: 'Web Development Fundamentals',
      shortDescription: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
      description:
        'This comprehensive course covers everything you need to know to get started with web development. You will learn HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of this course, you will be able to build responsive websites from scratch.',
      category: CourseCategory.ITSoftware,
      price: 29.99,
      thumbnail:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Flanding_page%2FCourse%20Images%20(1).png?alt=media&token=a43b06ef-e639-4ea8-aff7-537554e2ef45',
      backgroundImage:
        'https://firebasestorage.googleapis.com/v0/b/questify-a190e.firebasestorage.app/o/images%2Fislands%2Fbackground.png?alt=media&token=6881fef8-d3fd-4bcb-99c0-bad208f4ee70',
      learningObjectives: [
        'Understand HTML structure',
        'Create styles with CSS',
        'Add interactivity with JavaScript',
      ],
      requirements: ['Basic computer skills', 'No prior coding experience needed'],
      targetAudience: [
        'Aspiring web developers',
        'Designers looking to code their designs',
      ],
      status: CourseStatus.Approved, // Set to Approved so students can enroll immediately
    });

    const course = courseResponse.data;
    const courseId = course.id;
    console.log('Course created successfully with ID:', courseId);

    // Create one island with predefined UUID
    console.log('\nCreating island...');
    const islandResponse = await api.post(
      ResourcePrefix.CourseManagement + `/${courseId}/islands`,
      {
        id: REVIEW_ISLAND_ID, // Predefined UUID for the island
        name: 'HTML Fundamentals',
        description: 'Learn the basics of HTML to structure web pages',
        pathType: IslandPathType.ForestPath,
      },
    );

    const island = islandResponse.data;
    const islandId = island.id;
    console.log(`Island created with ID: ${islandId}`);

    // Add a delay to allow the event to be processed
    console.log(`Waiting for island creation event to be processed...`);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create one level for the island with predefined UUID
    console.log('\nCreating level...');
    await api.post(ResourcePrefix.CourseManagement + `/islands/${islandId}/level`, {
      id: REVIEW_LEVEL_ID, // Predefined UUID for the level
      name: 'HTML Basics',
      description: 'Introduction to HTML tags and document structure',
      position: 0,
    });
    console.log('Level created successfully');

    // Sign out
    await api.post(ResourcePrefix.Auth + '/signout', {});
    console.log('Teacher signed out successfully.');

    return courseId;
  } catch (error) {
    console.error('Error creating review course:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Have each student enroll in the course and write a review
 */
async function enrollAndReview(courseId: string, students: StudentCredentials[]) {
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    try {
      console.log(`\nProcessing student ${i + 1} of ${students.length}: ${student.userName}`);
      
      // Login as student
      await api.post(ResourcePrefix.Auth + '/signin', {
        email: student.email,
        password: student.password,
      });
      console.log(`${student.userName} login successful`);
      
      // Enroll in course
      console.log(`Enrolling in course...`);
      await api.post(ResourcePrefix.CourseManagement + `/${courseId}/enrollment`, {});
      console.log(`Enrollment successful`);
      
      // Write a review with a random comment and rating
      const rating = ratings[i % ratings.length];
      const comment = reviewComments[i % reviewComments.length];
      
      console.log(`Writing review (${rating} stars)...`);
      await api.post(ResourcePrefix.CourseManagement + `/${courseId}/reviews`, {
        comment,
        rating,
      });
      console.log(`Review submitted successfully`);
      
      // Sign out
      await api.post(ResourcePrefix.Auth + '/signout', {});
      console.log(`${student.userName} signed out successfully`);
      
      // Small delay between students
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error with student ${student.userName}:`, error.response?.data || error.message);
      // Continue with next student even if one fails
    }
  }
  console.log(`\nAll ${students.length} students have enrolled and written reviews`);
}

// Run if this script is executed directly
if (require.main === module) {
  seedReviewFlow();
}

export default seedReviewFlow;