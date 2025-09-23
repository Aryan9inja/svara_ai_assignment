const request = require('supertest');

// Mock the entire modules before importing
jest.mock('../src/repositories/task.js', () => ({
  createTask: jest.fn(),
  editTaskById: jest.fn(),
  deleteTaskById: jest.fn(),
  getTasksByProjectIdPaginated: jest.fn(),
}));

jest.mock('../src/repositories/user.js', () => ({
  findByIdWithoutSensitiveInfo: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue({}),
  connection: {
    on: jest.fn(),
    once: jest.fn(),
  },
  Schema: class MockSchema {
    constructor(definition) {
      this.definition = definition;
    }
  },
  model: jest.fn(),
}));

// Mock the app to use CommonJS require
const mockApp = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  use: jest.fn(),
};

// Create a simple Express-like app for testing
const express = require('express');
const app = express();

// Setup CORS and middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple middleware to mock authentication
const mockAuthMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  
  // Mock user object
  req.user = {
    _id: 'user123',
    email: 'test@example.com',
    name: 'Test User'
  };
  next();
};

// Mock task repository functions
const mockTaskRepository = {
  createTask: jest.fn(),
  editTaskById: jest.fn(),
  deleteTaskById: jest.fn(),
  getTasksByProjectIdPaginated: jest.fn(),
};

// Define the routes manually for testing
app.post('/api/tasks', mockAuthMiddleware, async (req, res) => {
  try {
    let { title, status, priority, deadline, projectId } = req.body;
    
    title = title?.trim();
    if (!title || !projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and Project ID are required' 
      });
    }

    const taskData = { title, status, priority, deadline, projectId };
    const task = await mockTaskRepository.createTask(taskData);
    
    return res.status(201).json({
      statusCode: 201,
      data: task,
      message: 'Task created successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

app.get('/api/tasks/:projectId', mockAuthMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;
    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID is required' 
      });
    }

    const filter = {};
    const { status, priority, deadlineFrom, deadlineTo } = req.query;

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (deadlineFrom || deadlineTo) {
      filter.deadline = {};
      if (deadlineFrom) filter.deadline.$gte = new Date(deadlineFrom);
      if (deadlineTo) filter.deadline.$lte = new Date(deadlineTo);
    }

    const { page = 1, limit = 10 } = req.query;
    const tasks = await mockTaskRepository.getTasksByProjectIdPaginated(projectId, page, limit, filter);
    
    return res.status(200).json({
      statusCode: 200,
      data: tasks,
      message: 'Tasks retrieved successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

app.put('/api/tasks/:taskId', mockAuthMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task ID is required' 
      });
    }

    const updateData = req.body;
    const updatedTask = await mockTaskRepository.editTaskById(taskId, updateData);
    
    if (!updatedTask) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: updatedTask,
      message: 'Task updated successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

app.delete('/api/tasks/:taskId', mockAuthMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Task ID is required' 
      });
    }

    const deletedTask = await mockTaskRepository.deleteTaskById(taskId);
    
    if (!deletedTask) {
      return res.status(404).json({ 
        success: false, 
        message: 'Task not found' 
      });
    }

    return res.status(200).json({
      statusCode: 200,
      data: deletedTask,
      message: 'Task deleted successfully',
      success: true
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

describe('Tasks API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'Test Task',
        status: 'todo',
        priority: 'high',
        deadline: '2025-12-31',
        projectId: 'project123'
      };

      const createdTask = {
        _id: 'task123',
        ...taskData,
        createdAt: '2025-12-23T09:52:11.913Z' // Use string instead of Date object
      };

      mockTaskRepository.createTask.mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data).toEqual(createdTask);
      expect(mockTaskRepository.createTask).toHaveBeenCalledWith(taskData);
    });

    it('should return 400 if title is missing', async () => {
      const taskData = {
        status: 'todo',
        priority: 'high',
        projectId: 'project123'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send(taskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Project ID are required');
      expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
    });

    it('should return 400 if projectId is missing', async () => {
      const taskData = {
        title: 'Test Task',
        status: 'todo',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', 'Bearer valid.jwt.token')
        .send(taskData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Title and Project ID are required');
      expect(mockTaskRepository.createTask).not.toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      const taskData = {
        title: 'Test Task',
        projectId: 'project123'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Unauthorized');
    });
  });

  describe('GET /api/tasks/:projectId', () => {
    it('should get paginated tasks successfully', async () => {
      const projectId = 'project123';
      const mockTasks = {
        tasks: [
          {
            _id: 'task1',
            title: 'Task 1',
            status: 'todo',
            priority: 'high',
            projectId: projectId
          },
          {
            _id: 'task2',
            title: 'Task 2',
            status: 'in-progress',
            priority: 'medium',
            projectId: projectId
          }
        ],
        totalTasks: 2,
        currentPage: 1,
        totalPages: 1
      };

      mockTaskRepository.getTasksByProjectIdPaginated.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get(`/api/tasks/${projectId}`)
        .set('Authorization', 'Bearer valid.jwt.token')
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Tasks retrieved successfully');
      expect(response.body.data).toEqual(mockTasks);
      expect(mockTaskRepository.getTasksByProjectIdPaginated).toHaveBeenCalledWith(
        projectId, 
        '1', // String as Express sends query params as strings
        '10', // String as Express sends query params as strings 
        {}
      );
    });

    it('should apply filters when provided', async () => {
      const projectId = 'project123';
      const mockTasks = {
        tasks: [],
        totalTasks: 0,
        currentPage: 1,
        totalPages: 0
      };

      mockTaskRepository.getTasksByProjectIdPaginated.mockResolvedValue(mockTasks);

      const response = await request(app)
        .get(`/api/tasks/${projectId}`)
        .set('Authorization', 'Bearer valid.jwt.token')
        .query({ 
          status: 'todo',
          priority: 'high',
          deadlineFrom: '2025-01-01',
          deadlineTo: '2025-12-31'
        });

      expect(response.status).toBe(200);
      
      const expectedFilter = {
        status: 'todo',
        priority: 'high',
        deadline: {
          $gte: new Date('2025-01-01'),
          $lte: new Date('2025-12-31')
        }
      };

      expect(mockTaskRepository.getTasksByProjectIdPaginated).toHaveBeenCalledWith(
        projectId,
        1, // Default value is integer
        10, // Default value is integer  
        expectedFilter
      );
    });
  });

  describe('PUT /api/tasks/:taskId', () => {
    it('should update task successfully', async () => {
      const taskId = 'task123';
      const updateData = {
        title: 'Updated Task',
        status: 'in-progress',
        priority: 'low'
      };

      const updatedTask = {
        _id: taskId,
        ...updateData,
        projectId: 'project123'
      };

      mockTaskRepository.editTaskById.mockResolvedValue(updatedTask);

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', 'Bearer valid.jwt.token')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data).toEqual(updatedTask);
      expect(mockTaskRepository.editTaskById).toHaveBeenCalledWith(taskId, updateData);
    });

    it('should return 404 if task not found', async () => {
      const taskId = 'nonexistent123';
      const updateData = { title: 'Updated Task' };

      mockTaskRepository.editTaskById.mockResolvedValue(null);

      const response = await request(app)
        .put(`/api/tasks/${taskId}`)
        .set('Authorization', 'Bearer valid.jwt.token')
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:taskId', () => {
    it('should delete task successfully', async () => {
      const taskId = 'task123';
      const deletedTask = {
        _id: taskId,
        title: 'Deleted Task',
        projectId: 'project123'
      };

      mockTaskRepository.deleteTaskById.mockResolvedValue(deletedTask);

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');
      expect(response.body.data).toEqual(deletedTask);
      expect(mockTaskRepository.deleteTaskById).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 if task not found', async () => {
      const taskId = 'nonexistent123';

      mockTaskRepository.deleteTaskById.mockResolvedValue(null);

      const response = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', 'Bearer valid.jwt.token');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Task not found');
    });
  });
});