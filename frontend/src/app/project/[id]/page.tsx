"use client";

import React from "react";
import { KanbanBoard } from "@/components/kanban";
import { useParams } from "next/navigation";
import { Container, Typography } from "@mui/material";

import { Button } from "@mui/material";
import TaskModal from "@/components/kanban/TaskModal";
import { useState } from "react";
import type { Task } from "@/components/kanban/KanbanBoard";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

const ProjectPage = () => {
  // Filter modal state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    deadlineFrom: "",
    deadlineTo: "",
  });

  const handleOpenFilter = () => setFilterOpen(true);
  const handleCloseFilter = () => setFilterOpen(false);
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const handleApplyFilter = () => {
    setRefreshTasksFlag((f) => f + 1);
    setFilterOpen(false);
  };
  const params = useParams();
  const projectId = params?.id as string;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null); // null for create, task object for edit
  const [refreshTasksFlag, setRefreshTasksFlag] = useState(0);

  // Open modal for create
  const handleCreateTask = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditTask(null);
  };

  // Callback for TaskModal to trigger KanbanBoard refresh
  const handleTaskSaved = () => {
    setRefreshTasksFlag((f) => f + 1);
  };

  return (
    <Container maxWidth="lg">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{ mb: 1, letterSpacing: 1 }}
          >
            Project Tasks
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 0 }}>
            Manage and track your project tasks visually with Kanban.
          </Typography>
        </div>
        <div style={{ display: "flex", gap: 16 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ boxShadow: 2, borderRadius: 2, textTransform: "none" }}
            onClick={handleCreateTask}
            aria-label="Create a new task"
          >
            + Create Task
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="large"
            sx={{ borderRadius: 2, textTransform: "none" }}
            onClick={handleOpenFilter}
            aria-label="Filter tasks"
          >
            Filter
          </Button>
        </div>
      </div>
      <div style={{ marginBottom: 32 }}>
        <KanbanBoard
          projectId={projectId}
          onEditTask={handleEditTask}
          key={refreshTasksFlag}
          filters={filters}
        />
      </div>
      <TaskModal
        open={modalOpen}
        onClose={handleCloseModal}
        projectId={projectId}
        task={editTask ?? undefined}
        onTaskSaved={handleTaskSaved}
      />
      {/* Filter Modal */}
      <Dialog
        open={filterOpen}
        onClose={handleCloseFilter}
        PaperProps={{ sx: { borderRadius: 3, p: 2, minWidth: 400 } }}
        aria-labelledby="filter-dialog-title"
      >
        <DialogTitle
          id="filter-dialog-title"
          sx={{ fontWeight: 600, fontSize: 22, pb: 1 }}
        >
          Filter Tasks
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            size="medium"
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
          <TextField
            select
            label="Priority"
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            size="medium"
            sx={{ mb: 2 }}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </TextField>
          <TextField
            label="Deadline From"
            name="deadlineFrom"
            type="date"
            value={filters.deadlineFrom}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            size="medium"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            helperText="Show tasks with deadline after this date"
          />
          <TextField
            label="Deadline To"
            name="deadlineTo"
            type="date"
            value={filters.deadlineTo}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            size="medium"
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
            helperText="Show tasks with deadline before this date"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseFilter}
            color="inherit"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyFilter}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProjectPage;
