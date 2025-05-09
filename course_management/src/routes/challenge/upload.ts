// import express, { Request, Response } from 'express';
// import { body } from 'express-validator';
// import fileUpload from 'express-fileupload';
// import {
//   validateRequest,
//   requireAuth,
//   ResourcePrefix,
//   BadRequestError,
//   NotAuthorizedError,
// } from '@datn242/questify-common';
// import { uploadImage } from '../../services/firebase/uploadImage';
// import { pdfPageToImage, bufferToFile } from '../../services/upload-pdf';
// import { Slide, SlideType } from '../../models/slide';
// import { Level } from '../../models/level';
// import { Island } from '../../models/island';
// import { Course } from '../../models/course';
// import { Challenge } from '../../models/challenge';
// import { PDFDocument } from 'pdf-lib';

// const router = express.Router();

// // Apply express-fileupload middleware
// router.use(
//   fileUpload({
//     limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
//     abortOnLimit: true,
//     responseOnLimit: 'File size limit has been reached',
//   }),
// );

// router.post(
//   ResourcePrefix.CourseManagement + '/level/:level_id/challenge/upload',
//   requireAuth,
//   [
//     body('folderPath').notEmpty().withMessage('Folder path is required').trim(),
//     body('timeout').optional().isInt({ min: 0 }).withMessage('Timeout must be a positive number'),
//   ],
//   validateRequest,
//   async (req: Request, res: Response): Promise<void> => {
//     try {
//       // Check if files exist
//       if (!req.files || !req.files.pdfFile) {
//         throw new BadRequestError('PDF file is required');
//       }

//       // Get the PDF file (handle both single file and array cases)
//       const pdfFile = Array.isArray(req.files.pdfFile) ? req.files.pdfFile[0] : req.files.pdfFile;

//       // Check if it's a PDF
//       if (!pdfFile.mimetype.includes('pdf')) {
//         throw new BadRequestError('File must be a PDF');
//       }

//       const pdfBuffer = pdfFile.data;

//       const { level_id } = req.params;
//       const level = await Level.findByPk(level_id);

//       if (!level) {
//         throw new BadRequestError('Level not found');
//       }

//       const island = await Island.findByPk(level.islandId, {
//         include: [
//           {
//             model: Course,
//             as: 'Course',
//             required: false,
//           },
//         ],
//       });

//       if (!island) {
//         throw new BadRequestError('Island not found');
//       }

//       const course = island.get('Course') as Course;

//       if (course.teacherId !== req.currentUser!.id) {
//         throw new NotAuthorizedError();
//       }

//       const challenge = Challenge.build({
//         levelId: level.id.toString(),
//       });

//       await challenge.save();

//       const { folderPath, timeout } = req.body;

//       // Get the number of pages in the PDF using pdf-lib instead of pdfjs-dist
//       const pdfDoc = await PDFDocument.load(pdfBuffer);
//       const pageCount = pdfDoc.getPageCount();

//       // Process each page and upload as image
//       const uploadPromises = [];

//       for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
//         try {
//           // Convert page to image
//           const imageBuffer = await pdfPageToImage(pdfBuffer, pageNum);

//           // Create a filename for the image
//           const imageFilename = `page-${pageNum}-${pdfFile.name.replace('.pdf', '.png')}`;

//           // Convert buffer to File object for uploadImage function
//           const imageFile = bufferToFile(imageBuffer, imageFilename, 'image/png');

//           // Upload the image to Firebase using existing uploadImage function
//           const uploadOptions = {
//             folderPath: `${folderPath}/page-${pageNum}`,
//             timeout: timeout ? parseInt(timeout) : undefined,
//           };

//           const uploadPromise = uploadImage(imageFile, uploadOptions).then(async (url) => {
//             // Create a new slide in the database
//             const slide = Slide.build({
//               challengeId: challenge.id.toString(),
//               imageUrl: url,
//               slideNumber: pageNum,
//               type: SlideType.PDF_SLIDE,
//             });

//             await slide.save();

//             return {
//               slideId: slide.id,
//               slideNumber: pageNum,
//               imageUrl: url,
//             };
//           });

//           uploadPromises.push(uploadPromise);
//         } catch (error) {
//           console.error(`Error processing page ${pageNum}:`, error);
//           // Continue with other pages even if one fails
//         }
//       }

//       // Wait for all uploads and database operations to complete
//       const results = await Promise.all(uploadPromises);

//       // Sort results by slide number
//       results.sort((a, b) => a.slideNumber - b.slideNumber);

//       res.status(201).send({
//         message: 'PDF successfully converted to slides and saved',
//         pageCount,
//         challenge,
//         slides: results,
//       });
//     } catch (error) {
//       console.error('PDF processing error:', error);
//       res.status(500).send({
//         message: 'Error processing PDF file',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       });
//     }
//   },
// );

// export { router as uploadChallengeRouter };
