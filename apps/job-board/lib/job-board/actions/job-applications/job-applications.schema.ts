import { z } from 'zod';

export const CreateJobSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  columnId: z.string(),
  boardId: z.string(),
  location: z.string().optional(),
  notes: z.string().optional(),
  salary: z.string().optional(),
  jobUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
});

export type JobApplicationData = z.infer<typeof CreateJobSchema>;

export const UpdateJobSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
  columnId: z.string().optional(),
  order: z.number().min(0).optional(),
  // ... add other fields
});

export type JobApplicationUpdates = z.infer<typeof UpdateJobSchema>;

export function serialize<T>(data: T): T {
  if (!data) return data;
  return JSON.parse(JSON.stringify(data));
}
