import React from "react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";
import { Paper, Typography } from "@mui/material";

import { Task } from "./KanbanBoard";

interface KanbanColumnProps {
  status: string;
  tasks: Task[];
  onEditTask?: (task: Task) => void;
}

const statusLabels: Record<string, string> = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "done": "Done",
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, tasks, onEditTask }) => {
  return (
    <Paper elevation={4} sx={{
      p: 2,
      minWidth: 320,
      height: '100%',
      borderRadius: 4,
      background: '#f5f7fa',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 700,
          letterSpacing: 0.5,
          color: status === 'todo' ? 'info.main' : status === 'in-progress' ? 'warning.main' : 'primary.main',
          borderBottom: '2px solid',
          borderColor: status === 'todo' ? 'info.light' : status === 'in-progress' ? 'warning.light' : 'primary.light',
          pb: 1,
        }}
      >
        {statusLabels[status]}
      </Typography>
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ minHeight: 120, maxHeight: '60vh', overflowY: 'auto', paddingRight: 4 }}
          >
            {tasks.map((task, idx) => (
              <Draggable key={task._id} draggableId={task._id} index={idx}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                    {...dragProvided.dragHandleProps}
                  >
                    <TaskCard
                      title={task.title}
                      priority={task.priority}
                      deadline={task.deadline}
                      status={task.status}
                      onClick={() => onEditTask && onEditTask(task)}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Paper>
  );
};

export default KanbanColumn;
