/**
 * Full Flow Seed Script
 *
 * This script orchestrates the complete seeding process in the following order:
 * 1. Sign up teacher, student, and admin users
 * 2. Create item templates
 * 3. Teacher creates a course with islands and levels
 * 4. Student enrolls in the course
 * 5. Update student progress to simulate course activity
 *
 */
import { execSync } from 'child_process';
import path from 'path';

async function runFullFlowSeed() {
  try {
    console.log('=== QUESTIFY FULL SEEDING PROCESS ===');

    // Step 1: Sign up users
    console.log('\n[1/5] Creating users (teacher, student, admin)...');
    execSync('ts-node ' + path.join(__dirname, 'signup-seeds.ts'), { stdio: 'inherit' });

    // Step 2: Create item templates
    console.log('\n[2/5] Creating item templates...');
    execSync('ts-node ' + path.join(__dirname, 'item-templates-seed.ts'), { stdio: 'inherit' });

    // Step 3: Teacher creates course, islands, and levels
    console.log('\n[3/5] Creating course with islands and levels...');
    execSync('ts-node ' + path.join(__dirname, 'teacher-course-seed.ts'), { stdio: 'inherit' });

    // Step 4: Student enrolls in course
    console.log('\n[4/5] Student enrolling in course...');
    execSync('ts-node ' + path.join(__dirname, 'student-enroll-seed.ts'), { stdio: 'inherit' });

    // Step 5: Update student progress
    console.log('\n[5/5] Updating student progress...');
    execSync('ts-node ' + path.join(__dirname, 'student-progress-seed.ts'), { stdio: 'inherit' });

    console.log('\n=== SEEDING COMPLETED SUCCESSFULLY ===');
  } catch (error) {
    console.error('Error during seeding process:', error);
    process.exit(1);
  }
}

runFullFlowSeed();
