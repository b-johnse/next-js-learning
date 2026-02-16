'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '../../../auth/auth';
import connectDB from '../../../db';
import { Column, JobApplication } from '../../../models';
import {
  serialize,
  UpdateJobSchema,
  type JobApplicationUpdates,
} from './job-applications.schema';

export async function updateJobApplication(
  id: string,
  rawInput: JobApplicationUpdates,
) {
  const session = await getSession();
  if (!session?.user) return { error: 'Unauthorized' };

  const result = UpdateJobSchema.safeParse(rawInput);
  if (!result.success) return { error: 'Invalid Input' };

  const updates = result.data;
  const { columnId: newColumnId, order: newOrder, ...restFields } = updates;
  const fields: typeof updates = { ...restFields };

  await connectDB();
  const job = await JobApplication.findOne({
    _id: id,
    userId: session.user.id,
  });
  if (!job) return { error: 'Not found' };

  const oldColumnId = job.columnId.toString();
  const oldOrder = job.order;

  // SCENARIO 1: Moving to a different column
  if (newColumnId && newColumnId !== oldColumnId) {
    // 1. Repair old column order (Close the gap)
    await JobApplication.updateMany(
      { columnId: oldColumnId, order: { $gt: oldOrder } },
      { $inc: { order: -1 } },
    );
    await Column.findByIdAndUpdate(oldColumnId, {
      $pull: { jobApplications: id },
    });

    // 2. Make space in new column
    const targetOrder = newOrder ?? 0;
    await JobApplication.updateMany(
      { columnId: newColumnId, order: { $gte: targetOrder } },
      { $inc: { order: 1 } },
    );

    // 3. Finalize Update
    const updated = await JobApplication.findByIdAndUpdate(
      id,
      {
        ...fields,
        columnId: newColumnId,
        order: targetOrder,
      },
      { new: true },
    );

    await Column.findByIdAndUpdate(newColumnId, {
      $push: { jobApplications: id },
    });

    revalidatePath('/dashboard');
    return { data: serialize(updated) };
  }

  // SCENARIO 2: Reordering within same column
  if (newOrder !== undefined && newOrder !== oldOrder) {
    if (newOrder > oldOrder) {
      // Moving down: decrement items between old and new
      await JobApplication.updateMany(
        { columnId: oldColumnId, order: { $gt: oldOrder, $lte: newOrder } },
        { $inc: { order: -1 } },
      );
    } else {
      // Moving up: increment items between new and old
      await JobApplication.updateMany(
        { columnId: oldColumnId, order: { $gte: newOrder, $lt: oldOrder } },
        { $inc: { order: 1 } },
      );
    }
    fields.order = newOrder;
  }

  const updated = await JobApplication.findByIdAndUpdate(id, fields, {
    new: true,
  });
  revalidatePath('/dashboard');
  return { data: serialize(updated) };
}
