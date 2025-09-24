# Backend API - Task Management System

A Node.js/Express.js REST API for a task management system with user authentication, project management, and task tracking capabilities.

## 🚀 Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **Project Management**: Create, read, and delete projects
- **Task Management**: Full CRUD operations for tasks with status tracking
- **Security**: Password hashing, protected routes, and CORS configuration
- **Testing**: Comprehensive test suite with Jest
- **Database**: MongoDB with Mongoose ODM

## 📋 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Testing**: Jest & Supertest
- **Environment**: dotenv
- **Development**: Nodemon

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/svaraai
   ACCESS_TOKEN_SECRET=your_strong_access_token_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_strong_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d
   CLIENT_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system or update the `MONGO_URI` to point to your MongoDB instance.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   ```

## 🧩 Architecture

- **SOLID & DRY Principles:** Controllers, services, repositories, and utils are separated for maintainability and scalability.
- **Error Handling:** Centralized error handler and consistent API responses.
- **Authentication:** JWT-based, with middleware for route protection.

## API Endpoints

- `/api/auth` – Register, login, logout, refresh, get current user
- `/api/projects` – Create, list, delete projects
- `/api/tasks` – Create, edit, delete, fetch by project (with filters & pagination)
- `/api/dashboard` – Dashboard summary

## 🧪 Testing

Run backend unit tests (Jest):
```bash
npm test
```
See `tests/README.md` for details.

---
See main `README.md` for project overview.
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:4000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Refresh Token
```http
POST /api/auth/refresh
```

#### Get Current User (Protected)
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### Project Endpoints

#### Create Project (Protected)
```http
POST /api/projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Project Description"
}
```

#### Get All Projects (Protected)
```http
GET /api/projects
Authorization: Bearer <access_token>
```

#### Delete Project (Protected)
```http
DELETE /api/projects/:id
Authorization: Bearer <access_token>
```

### Task Endpoints

#### Create Task (Protected)
```http
POST /api/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Task Title",
  "status": "todo",
  "priority": "medium",
  "deadline": "2024-12-31T23:59:59.000Z",
  "projectId": "project_object_id"
}
```

#### Get Tasks by Project (Protected)
```http
GET /api/tasks/:projectId
Authorization: Bearer <access_token>
```

#### Update Task (Protected)
```http
PUT /api/tasks/:taskId
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Updated Task Title",
  "status": "in-progress",
  "priority": "high"
}
```

#### Delete Task (Protected)
```http
DELETE /api/tasks/:taskId
Authorization: Bearer <access_token>
```

## 📊 Data Models

### User Model
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  refreshToken: String,
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

### Project Model
```javascript
{
  name: String (required),
  description: String,
  userId: ObjectId (required, ref: 'User'),
  createdAt: Date (default: Date.now)
}
```

### Task Model
```javascript
{
  title: String (required),
  status: String (enum: ['todo', 'in-progress', 'done'], default: 'todo'),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  deadline: Date,
  projectId: ObjectId (required, ref: 'Project'),
  createdAt: Date (default: Date.now)
}
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

The test coverage reports are generated in the `coverage/` directory.

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── auth.js               # Authentication controllers
│   │   ├── project.js            # Project controllers
│   │   └── task.js               # Task controllers
│   ├── middlewares/
│   │   ├── auth.js               # Authentication middleware
│   │   └── error.js              # Error handling middleware
│   ├── models/
│   │   ├── user.js               # User model
│   │   ├── project.js            # Project model
│   │   └── task.js               # Task model
│   ├── repositories/
│   │   ├── user.js               # User data access layer
│   │   ├── project.js            # Project data access layer
│   │   └── task.js               # Task data access layer
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   ├── project.js            # Project routes
│   │   └── task.js               # Task routes
│   ├── services/
│   │   ├── auth.js               # Authentication business logic
│   │   ├── project.js            # Project business logic
│   │   └── task.js               # Task business logic
│   ├── utils/
│   │   ├── apiError.js           # Custom error class
│   │   ├── apiRes.js             # API response utility
│   │   └── asyncHandler.js       # Async error handler
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point
├── tests/
│   ├── task.test.js              # Task endpoint tests
│   └── README.md                 # Test documentation
├── coverage/                     # Test coverage reports
├── .env.example                  # Environment variables template
├── .env                          # Environment variables (not in git)
├── jest.config.json              # Jest configuration
└── package.json                  # Node.js dependencies and scripts
```

## 🔒 Security Features

- **Password Hashing**: Using bcrypt with salt rounds
- **JWT Authentication**: Access and refresh token implementation
- **Protected Routes**: Middleware-based route protection
- **CORS Configuration**: Cross-origin resource sharing setup
- **Input Validation**: Request validation and sanitization
- **Error Handling**: Centralized error management

## 🚦 Status Codes

The API uses standard HTTP status codes:

- `200` - OK (Success)
- `201` - Created (Resource created successfully)
- `400` - Bad Request (Invalid request data)
- `401` - Unauthorized (Authentication required)
- `403` - Forbidden (Access denied)
- `404` - Not Found (Resource not found)
- `500` - Internal Server Error (Server error)

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/svaraai` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | Required |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration | `15m` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | Required |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration | `7d` |
| `CLIENT_URL` | Frontend application URL | `http://localhost:3000` |