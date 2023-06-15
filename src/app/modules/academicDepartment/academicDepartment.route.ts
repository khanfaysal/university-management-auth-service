import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentServiceValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';

const router = express.Router();

router.post(
  '/create-department',
  validateRequest(
    AcademicDepartmentServiceValidation.createAcademicDepartmentZodSchema
  ),
  AcademicDepartmentController.createDepartment
);

router.get('/:id', AcademicDepartmentController.getSingleDepartment);

router.get('/', AcademicDepartmentController.getAllDepartments);

export const AcademicDepartmentRoutes = router;
