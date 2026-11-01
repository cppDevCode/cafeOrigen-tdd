
import { z } from 'zod';

export const ErrorApiSchema = z.object({
  error: z.string().min(1)
});

export type ErrorApi = z.infer<typeof ErrorApiSchema>;
