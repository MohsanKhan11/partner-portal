# Partner Portal API

A horizontally scalable user management service with role-based access control (RBAC) and efficient caching.

## Features

- Full CRUD support for user entities
- Role-based access control (RBAC)
- Efficient caching with Redis
- Real-time username validation
- Rate limiting
- Comprehensive logging
- TypeScript support

## Tech Stack

- Node.js
- Fastify
- TypeScript
- MongoDB
- Redis
- JWT Authentication

## Prerequisites

- Node.js (v20 or higher)
- MongoDB
- Redis
- npm

## Installation



1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:


3. Start the server:
```bash
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Test@123",
  "username": "testuser",
  "fullName": "Test User"
}
```
Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "Test@123"
}
```
Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Username Validation
```http
GET /auth/validate/testuser
```
Response (200):
```json
{
  "available": false
}
```

### User Management Endpoints

#### Get Current User
```http
GET /users
Authorization: Bearer <token>
```
Response (200):
```json
{
  "email": "user@example.com",
  "username": "testuser",
  "fullName": "Test User",
  "role": "viewer",
  "createdAt": "2024-03-19T10:00:00.000Z",
  "updatedAt": "2024-03-19T10:00:00.000Z"
}
```

#### Get All Users
```http
GET /users/all
Authorization: Bearer <token>
```
Response (200):
```json
[
  {
    "email": "user1@example.com",
    "username": "user1",
    "fullName": "User One",
    "role": "admin",
    "createdAt": "2024-03-19T10:00:00.000Z",
    "updatedAt": "2024-03-19T10:00:00.000Z"
  }
]
```

#### Update User
```http
PATCH /users/testuser
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Updated Name",
  "email": "updated@example.com",
  "password": "NewPass@123",
  "role": "editor"
}
```
Response (200):
```json
{
  "email": "updated@example.com",
  "username": "testuser",
  "fullName": "Updated Name",
  "role": "editor",
  "createdAt": "2024-03-19T10:00:00.000Z",
  "updatedAt": "2024-03-19T10:30:00.000Z"
}
```

#### Delete User
```http
DELETE /users/testuser
Authorization: Bearer <token>
```
Response (200):
```json
{
  "success": true
}
```

## Role-Based Access Control

### Roles and Permissions

| Role | Read Users | Update Users | Delete Users | Manage Roles |
|------|------------|--------------|--------------|--------------|
| Admin | ✅ | ✅ | ✅ | ✅ |
| Editor | ✅ | ✅ | ❌ | ❌ |
| Viewer | ✅ (public only) | ❌ | ❌ | ❌ |

## Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Rate Limiting
- 5 requests per minute for auth endpoints
- Returns 429 status code when limit exceeded

### Caching Strategy
- Redis-based caching for user data
- Cache invalidation on updates/deletes
- Bloom filter for username validation

## Error Handling

The API uses standard HTTP status codes and returns errors in the following format:

```json
{
  "error": "Error message",
  "details": "Additional error details (if any)"
}
```

Common status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 429: Too Many Requests
- 500: Internal Server Error

## Development

### Scripts
```bash
npm run dev        # Start development server
```

### Project Structure
```
src/
├── config.ts           # Configuration
├── server.ts          # Server setup
├── models/            # Database models
├── routes/            # API routes
├── middlewares/       # Custom middlewares
├── utils/             # Utility functions
└── redisClient.ts     # Redis client
```

