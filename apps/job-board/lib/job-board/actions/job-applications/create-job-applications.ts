'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '../../../auth/auth';
import connectDB from '../../../db';
import { Board, Column, JobApplication } from '../../../models';
import {
  CreateJobSchema,
  type JobApplicationData,
} from './job-applications.schema';

export async function createJobApplication(rawInput: JobApplicationData) {
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const result = CreateJobSchema.safeParse(rawInput);
  if (!result.success) {
    return {
      error: 'Validation failed',
      details: result.error.flatten().fieldErrors,
    };
  }

  const data = result.data;

  await connectDB();

  const {
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    tags,
    description,
  } = data;

  // Verify board ownership
  const board = await Board.findOne({
    _id: boardId,
    userId: session.user.id,
  });

  if (!board) {
    return { error: 'Board not found' };
  }

  // Verify column belongs to board

  const column = await Column.findOne({
    _id: columnId,
    boardId: boardId,
  });

  if (!column) {
    return { error: 'Column not found' };
  }

  const maxOrder = await JobApplication.getNextOrder(columnId);

  const jobApplication = await JobApplication.create({
    company,
    position,
    location,
    notes,
    salary,
    jobUrl,
    columnId,
    boardId,
    userId: session.user.id,
    tags: tags || [],
    description,
    status: 'applied',
    order: maxOrder ? maxOrder + 1 : 0,
  });

  await Column.findByIdAndUpdate(columnId, {
    $push: { jobApplications: jobApplication._id },
  });

  revalidatePath('/dashboard');

  return {
    data: {
      ...jobApplication.toObject(),
      _id: jobApplication._id.toString(),
      // Convert any other Dates or ObjectIds to strings here
    },
  };
}
