import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Typography } from "@mui/material";
import { taskService } from "@/services/taskService";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
  task?: {
    _id: string;
    title: string;
    status: 'todo' | 'in-progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    deadline?: string | Date;
    projectId?: string;
    createdAt?: Date;
  }; // If present, edit mode; else, create mode
  onTaskSaved?: () => void; // Callback to refresh UI after save
}

const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, projectId, task, onTaskSaved }) => {

  const isEdit = !!task;
  const [title, setTitle] = useState(task?.title || "");
  const [status, setStatus] = useState(task?.status || "todo");
  const [priority, setPriority] = useState(task?.priority || "medium");
  const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset fields when modal opens/closes or task changes
  React.useEffect(() => {
  setTitle(task?.title || "");
    setStatus(task?.status || "todo");
    setPriority(task?.priority || "medium");
    setDeadline(task?.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : "");
    setError(null);
  }, [task, open]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isEdit) {
        await taskService.updateTask(task._id, {
          title,
          status,
          priority,
          deadline: deadline ? new Date(deadline) : undefined,
        });
      } else {
        await taskService.createTask({
          title,
          status,
          priority,
          deadline: deadline ? new Date(deadline) : undefined,
          projectId,
          createdAt: new Date(),
        });
      }
      if (onTaskSaved) onTaskSaved();
      onClose();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setError(error?.message || "Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 400 } }}
      aria-labelledby="task-modal-title"
    >
      <DialogTitle id="task-modal-title" sx={{ fontWeight: 600, fontSize: 22, pb: 1 }}>
        {isEdit ? "Edit Task" : "Create Task"}
      </DialogTitle>
      <DialogContent dividers>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          inputProps={{ maxLength: 60 }}
          helperText="Enter a short, descriptive title."
        />
        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          value={status}
          onChange={e => setStatus(e.target.value as 'todo' | 'in-progress' | 'done')}
          helperText="Select the current status of the task."
        >
          <MenuItem value="todo">To Do</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="done">Done</MenuItem>
        </TextField>
        <TextField
          select
          label="Priority"
          fullWidth
          margin="normal"
          value={priority}
          onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          helperText="How important is this task?"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </TextField>
        <TextField
          label="Deadline"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={deadline}
          onChange={e => setDeadline(e.target.value)}
          helperText="Set a due date for this task (optional)."
        />
        {error && (
          <Typography color="error" sx={{ mt: 2, fontSize: 14 }}>{error}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }} disabled={loading}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ textTransform: 'none', minWidth: 100 }}
          disabled={loading}
        >
          {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskModal;
