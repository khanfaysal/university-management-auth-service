import { z } from 'zod';
import {
  academicSemesterCodes,
  academicSemesterMonths,
  academicSemesterTitles,
} from './academicSemester.constant';

const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.enum([academicSemesterTitles[0], ...academicSemesterTitles], {
      required_error: 'Title is required',
    }),
    year: z.string({ required_error: 'Year is required' }),

    code: z.enum([academicSemesterCodes[0], ...academicSemesterCodes]),

    startMonth: z.enum([academicSemesterMonths[0], ...academicSemesterMonths], {
      required_error: 'Start month is required',
    }),

    endMonth: z.enum([academicSemesterMonths[0], ...academicSemesterMonths], {
      required_error: 'End month is required',
    }),
  }),
});

// Ensure 1: Route level : Update --> Give me title and code both, neither
const updateAcademicSemesterZodSchema = z
  .object({
    body: z.object({
      title: z
        .enum([academicSemesterTitles[0], ...academicSemesterTitles], {
          required_error: 'Title is required',
        })
        .optional(),
      year: z.string({ required_error: 'Year is required' }).optional(),

      code: z
        .enum([academicSemesterCodes[0], ...academicSemesterCodes])
        .optional(),

      startMonth: z
        .enum([academicSemesterMonths[0], ...academicSemesterMonths], {
          required_error: 'Start month is required',
        })
        .optional(),

      endMonth: z
        .enum([academicSemesterMonths[0], ...academicSemesterMonths], {
          required_error: 'End month is required',
        })
        .optional(),
    }),
  })
  .refine(
    data =>
      (data.body.title && data.body.code) ||
      (!data.body.title && !data.body.code),
    {
      message: 'Either both title and code should be provided or neither ',
    }
  );

export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
  updateAcademicSemesterZodSchema,
};
