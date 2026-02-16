'use client';

import { useBoard } from '@/lib/job-board/hooks/useBoards.hook';
import { Board } from '@/lib/models/models.types';
import { closestCorners, DndContext, DragOverlay } from '@dnd-kit/core';
import JobApplicationCard from '../job-application-card';
import { COLUMN_CONFIG, COLUMN_DEFAULT } from './board-config';
import DroppableColumn from './column/droppable-column';
import { useKanbanDrag } from './use-kanban-drag';

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

export default function KanbanBoard({ board, userId }: KanbanBoardProps) {
  const { columns, moveJob } = useBoard(board);

  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  const { activeId, sensors, handleDragStart, handleDragEnd } = useKanbanDrag({
    boardId: board._id,
    sortedColumns,
    moveJob,
  });

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeId);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sortedColumns.map((col, key) => {
            const config = COLUMN_CONFIG[key] || COLUMN_DEFAULT;
            return (
              <DroppableColumn
                key={key}
                column={col}
                config={config}
                boardId={board._id}
                sortedColumns={sortedColumns}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeJob ? (
          <div className="opacity-50">
            <JobApplicationCard job={activeJob} columns={sortedColumns} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
