"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import { taskService } from "@/services/taskService";
import Box from "@mui/material/Box";

export interface Task {
  _id: string;
  title: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  deadline?: string;
}

interface KanbanBoardProps {
  projectId: string;
  onEditTask?: (task: Task) => void;
  filters?: {
    status?: string;
    priority?: string;
    deadlineFrom?: string;
    deadlineTo?: string;
  };
}

const statuses: Array<Task["status"]> = ["todo", "in-progress", "done"];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ projectId, onEditTask, filters }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const filterParams: any = {};
    if (filters?.status) filterParams.status = filters.status;
    if (filters?.priority) filterParams.priority = filters.priority;
    if (filters?.deadlineFrom) filterParams.deadlineFrom = filters.deadlineFrom;
    if (filters?.deadlineTo) filterParams.deadlineTo = filters.deadlineTo;
    taskService.getPaginatedTasks(projectId, 1, 100, filterParams).then((data) => {
      setTasks(data.data || []);
    });
  }, [projectId, filters]);

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;
    const task = tasks.find((t) => t._id === draggableId);
    if (!task) return;
    // Update status locally
    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggableId ? { ...t, status: destination.droppableId as Task["status"] } : t
      )
    );
    // Update status in backend
    await taskService.updateTask(draggableId, { status: destination.droppableId });
  };

  const groupedTasks = statuses.reduce((acc, status) => {
    acc[status] = tasks.filter((t) => t.status === status);
    return acc;
  }, {} as Record<Task["status"], Task[]>);

  console.log("Grouped tasks:", groupedTasks);

  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 3 },
      background: '#f0f4f8',
      borderRadius: 4,
      boxShadow: 1,
      minHeight: '60vh',
      width: '100%',
      overflowX: 'auto',
    }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: { xs: 2, sm: 3 },
            alignItems: 'flex-start',
          }}
        >
          {statuses.map((status) => (
            <Box key={status} sx={{ minWidth: 320 }}>
              <KanbanColumn
                status={status}
                tasks={groupedTasks[status]}
                onEditTask={onEditTask}
              />
            </Box>
          ))}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default KanbanBoard;
