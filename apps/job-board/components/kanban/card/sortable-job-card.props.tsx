import { JobApplication, Column } from '@/lib/models/models.types';

export interface SortableJobCardProps {
  job: JobApplication;
  columns: Column[];
}
