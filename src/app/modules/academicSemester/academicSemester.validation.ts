
import { z } from "zod";

      const createAcademicSemesterZodSchema = z.object ({
        body: z.object({
          title:z.enum([])
        })
      })

      export const userValidation = {
        createUserZodSchema
      }
