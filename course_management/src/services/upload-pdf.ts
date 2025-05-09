// import sharp from 'sharp';

// /**
//  * Convert a PDF page to image directly using sharp
//  * Note: This may not work perfectly with all PDFs but avoids external dependencies
//  */
// export async function pdfPageToImage(pdfData: Buffer, pageNumber: number): Promise<Buffer> {
//   try {
//     // Sharp can directly convert the first page of PDFs to images
//     // Note: For multi-page PDFs, only the first page will be converted
//     // If pageNumber > 1, you'd need a different solution
//     if (pageNumber > 1) {
//       throw new Error('This implementation only supports converting the first page of PDFs');
//     }

//     // Use sharp to convert PDF to PNG
//     const pngBuffer = await sharp(pdfData, {
//       density: 300, // Higher DPI for better quality
//     })
//       .png()
//       .toBuffer();

//     return pngBuffer;
//   } catch (error) {
//     console.error('Error in pdfPageToImage:', error);
//     throw error;
//   }
// }

// /**
//  * Convert Buffer to File object for use with uploadImage
//  */
// export function bufferToFile(buffer: Buffer, filename: string, mimetype: string): any {
//   // Create a File-like object that works with your uploadImage function
//   return {
//     buffer,
//     name: filename,
//     type: mimetype,
//     size: buffer.length,

//     // If your uploadImage function uses File.arrayBuffer()
//     arrayBuffer: async () => buffer,

//     // If your uploadImage function uses these methods
//     text: async () => buffer.toString('utf-8'),

//     // If your uploadImage function uses this
//     stream: () => {
//       const { Readable } = require('stream');
//       return Readable.from(buffer);
//     },
//   };
// }
