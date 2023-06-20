import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { studentController } from './student.controller';
import { StudentValidation } from './student.validation';
const router = express.Router();

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getSingleStudent);
router.delete('/:id', studentController.deleteStudent);

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  studentController.updateStudent
);

export const StudentRoutes = router;
