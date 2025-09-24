# Authentication Setup Documentation

This document describes the persistent authentication setup implemented in the frontend application.

## Overview

The authentication system uses HTTP-only cookies for secure token storage and includes automatic token refresh functionality to maintain user sessions.

## Architecture Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
- Provides global authentication state management
- Handles user login, signup, logout, and token refresh
- Automatically checks authentication status on app start
- Includes automatic token refresh every 15 minutes

### 2. Auth Service (`src/services/authService.ts`)
- Handles API calls for authentication endpoints:
  - `POST /auth/register` - User registration
  - `POST /auth/login` - User login
  - `POST /auth/logout` - User logout
  - `GET /auth/me` - Get current user
  - `POST /auth/refresh` - Refresh access token

### 3. API Client (`src/lib/api.ts`)
- Configured with `withCredentials: true` for cookie handling
- Includes automatic token refresh interceptor
- Handles 401 responses by attempting token refresh
- Queues failed requests during refresh process

### 4. Route Guards (`src/components/auth/RouteGuards.tsx`)
- `ProtectedRoute`: Redirects unauthenticated users to login
- `PublicRoute`: Redirects authenticated users to dashboard

### 5. Auth Utilities (`src/utils/auth.ts`)
- Helper functions for auth-related operations
- Error message formatting
- Local storage utilities for preferences

## Key Features

### Automatic Token Refresh
- Tokens are refreshed every 15 minutes automatically
- Failed API requests trigger immediate refresh attempts
- Multiple simultaneous requests are queued during refresh

### Secure Cookie Handling
- Uses HTTP-only cookies for token storage
- No tokens stored in localStorage for security
- Automatic cookie inclusion with `withCredentials: true`

### Route Protection
- Protected routes require authentication
- Public routes redirect authenticated users
- Loading states during authentication checks

### Error Handling
- Comprehensive error messages
- Graceful handling of network failures
- Automatic logout on refresh failure

## Usage Examples

### Using the Auth Context
```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.email}!</div>;
}
```

### Protecting Routes
```tsx
import { ProtectedRoute } from '@/components/auth/RouteGuards';

function Dashboard() {
  return (
    <ProtectedRoute>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Public Routes (Login/Signup)
```tsx
import { PublicRoute } from '@/components/auth/RouteGuards';

function LoginPage() {
  return (
    <PublicRoute>
      <div>Login form</div>
    </PublicRoute>
  );
}
```

## Backend Requirements

The backend should implement the following endpoints:

- `POST /auth/register` - User registration
- `POST /auth/login` - User login (sets HTTP-only cookies)
- `POST /auth/logout` - User logout (clears cookies)
- `GET /auth/me` - Get current user (requires authentication)
- `POST /auth/refresh` - Refresh access token (uses refresh token from cookies)

## Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL` - Backend API base URL (defaults to `http://localhost:4000/api`)

### Token Refresh Interval
The automatic refresh interval can be adjusted in `AuthContext.tsx`:
```tsx
}, 15 * 60 * 1000); // Current: 15 minutes
```

## Security Considerations

1. **HTTP-only Cookies**: Tokens are stored in HTTP-only cookies, preventing XSS attacks
2. **Secure Connection**: Should be used over HTTPS in production
3. **Token Refresh**: Regular token refresh limits the impact of compromised tokens
4. **Error Handling**: Sensitive error information is not exposed to the client

## Testing

To test the authentication flow:

1. Start the backend server
2. Navigate to `/auth/signup` to create an account
3. Login with credentials
4. Access protected routes like `/dashboard`
5. Test automatic token refresh by waiting 15 minutes
6. Test logout functionality

## Troubleshooting

### Common Issues

1. **CORS Issues**: Ensure backend allows credentials and proper origin
2. **Cookie Issues**: Check that cookies are being set with correct domain/path
3. **Refresh Loops**: Check that refresh endpoint doesn't require authentication
4. **Network Errors**: Implement proper error boundaries and fallbacks

### Debug Tips

1. Check browser developer tools for network requests
2. Monitor cookie storage in Application tab
3. Check console for authentication-related logs
4. Verify backend cookie configuration