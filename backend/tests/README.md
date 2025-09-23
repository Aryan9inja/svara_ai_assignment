# Backend Tests

This directory contains Jest unit tests for the backend API.

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm run test:coverage
```

## Test Structure

- `task.test.js` - Unit tests for the Tasks API endpoints

### Tasks API Tests

The Tasks API tests cover the following endpoints:

1. **POST /api/tasks** - Create a new task
   - ✅ Creates task successfully with valid data
   - ✅ Returns 400 if title is missing
   - ✅ Returns 400 if projectId is missing  
   - ✅ Returns 401 if no authentication token provided

2. **GET /api/tasks/:projectId** - Get paginated tasks
   - ✅ Returns paginated tasks successfully
   - ✅ Applies filters (status, priority, deadline range) when provided

3. **PUT /api/tasks/:taskId** - Update a task
   - ✅ Updates task successfully with valid data
   - ✅ Returns 404 if task not found

4. **DELETE /api/tasks/:taskId** - Delete a task
   - ✅ Deletes task successfully
   - ✅ Returns 404 if task not found

## Test Features

- **Mocking**: All external dependencies (database repositories, JWT, mongoose) are mocked
- **Authentication**: Tests include mock authentication middleware
- **Error Handling**: Tests cover both success and error scenarios
- **Request/Response Validation**: Tests verify correct HTTP status codes and response formats
- **Mock Repository Functions**: Task repository functions are mocked to simulate database operations

The tests use a standalone Express app setup to avoid ES module complications while maintaining full test coverage of the API endpoints.