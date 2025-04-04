import express, { Request, Response } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { CodeProblem } from '../../models/code-problem';
import { Testcase } from '../../models/testcase';
import { validateRequest, requireAuth, UserRole, NotAuthorizedError, BadRequestError, ResourcePrefix } from '@datn242/questify-common';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases/xlss',
  requireAuth,
  upload.single('file'),
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const code_problem = await CodeProblem.findByPk(code_problem_id);
    if (!code_problem) {
      throw new BadRequestError('Code Problem not found');
    }

    if (!req.file) {
      throw new BadRequestError('No file uploaded');
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (!Array.isArray(data) || data.length < 2) {
      throw new BadRequestError('Invalid Excel file format');
    }

    const testcases = data.slice(1).map((row: any) => ({
      codeProblemId: code_problem.id,
      input: row[0] ? row[0].toString() : '',
      output: row[1] ? row[1].toString() : '',
      isShowed: false,
    }));

    await Testcase.bulkCreate(testcases);

    res.status(201).send({ message: 'Testcases created successfully', testcases });
  },
);

export { router as uploadTestcaseRouter };
