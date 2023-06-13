import { z } from 'zod';

/* 
      1. need to validate the request 
      2. id, role and password object to come through body and body is object
      3. And body which is object data exists

    */

const createUserZodSchema = z.object({
  body: z.object({
    user: z.object({
      role: z.string({
        required_error: 'Role is required',
      }),
      password: z.string().optional(),
    }),
  }),
});

export const userValidation = {
  createUserZodSchema,
};
