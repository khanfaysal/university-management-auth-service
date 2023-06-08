import { z } from "zod";
import { academicSemesterCodes, academicSemesterMonths, academicSemesterTitles } from './academicSemester.constant';

      const createAcademicSemesterZodSchema = z.object ({
        body: z.object({

          title:z.enum([academicSemesterTitles[0], ...academicSemesterTitles], {
            required_error: 'Title is required'
          }),
          year: z.number({required_error: 'Year is required'}),

          code: z.enum([academicSemesterCodes[0], ...academicSemesterCodes]),

          startMonth: z.enum([academicSemesterMonths[0], ...academicSemesterMonths],{required_error: 'Start month is required'}),

          endMonth: z.enum([academicSemesterMonths[0], ...academicSemesterMonths],{required_error: 'End month is required'})

        })
      })

      export const AcademicSemesterValidation = {
        createAcademicSemesterZodSchema
      }
