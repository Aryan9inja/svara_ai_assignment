
import React from "react";
import { Card, CardContent, Typography, Chip, Stack } from "@mui/material";

export interface TaskCardProps {
  title: string;
  priority: "low" | "medium" | "high";
  deadline?: string;
  status?: "todo" | "in-progress" | "done";
  onClick?: () => void;
}


const priorityColors: Record<string, "success" | "warning" | "error"> = {
  low: "success",
  medium: "warning",
  high: "error",
};

const statusLabels: Record<string, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusColors: Record<string, "default" | "info" | "primary"> = {
  todo: "default",
  "in-progress": "info",
  done: "primary",
};

const TaskCard: React.FC<TaskCardProps> = ({ title, priority, deadline, status, onClick }) => {
  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        borderRadius: 3,
        cursor: onClick ? "pointer" : "default",
        transition: "box-shadow 0.2s",
        '&:hover': { boxShadow: 6 },
        background: '#fafbfc',
      }}
      onClick={onClick}
    >
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={600} sx={{ flex: 1, pr: 1 }} noWrap>{title}</Typography>
          {status && (
            <Chip label={statusLabels[status]} color={statusColors[status]} size="small" sx={{ ml: 1 }} />
          )}
        </Stack>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip label={`Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}`} color={priorityColors[priority]} size="small" />
          {deadline && (
            <Chip
              label={`Due: ${new Date(deadline).toLocaleDateString()}`}
              color="secondary"
              size="small"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
