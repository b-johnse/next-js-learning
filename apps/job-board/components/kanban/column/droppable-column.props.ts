import { Column } from '@/lib/models/models.types';
import { ColConfig } from '../board-config';

export interface DroppableColumnProps {
  column: Column;
  config: ColConfig;
  boardId: string;
  sortedColumns: Column[];
}
