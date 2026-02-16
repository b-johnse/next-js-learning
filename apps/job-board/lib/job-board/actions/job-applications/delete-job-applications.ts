'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '../../../auth/auth';
import { Column, JobApplication } from '../../../models';

export async function deleteJobApplication(id: string) {
  const session = await getSession();

  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const jobApplication = await JobApplication.findById(id);

  if (!jobApplication) {
    return { error: 'Job application not found' };
  }

  if (jobApplication.userId !== session.user.id) {
    return { error: 'Unauthorized' };
  }

  await Column.findByIdAndUpdate(jobApplication.columnId, {
    $pull: { jobApplications: id },
  });

  await JobApplication.deleteOne({ _id: id });
  revalidatePath('/dashboard');

  return { success: true };
}
